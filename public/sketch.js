let sketch = function(p) {
    let board=[
        ['','',''],
        ['','',''],
        ['','','']
    ]
    let w=window.innerWidth;
    let h=window.innerHeight;
    let paddingx=w/2-150;
    let paddingy=h/2-150;
    let locked = false;
    let socket = io.connect('http://127.0.0.1:2000/');
    socket.on('execute',function(data){eval(data);})
    socket.on('message',function(data){
        console.log('message Recived',data);
        x=data[0];y=data[1];
        if(board[x][y]==''){
            board[x][y]='O';
            locked=false;
        }
    });
    p.setup = function(){
        p.createCanvas(w,h);
        p.RoomName = p.createInput()
        p.RoomName.style('width','250px');
        p.RoomName.style('padding','5px');
        p.RoomName.style('font-size','18px');
        p.RoomName.style('border-radius','15px');
        p.RoomName.style('height','30px');
        p.RoomName.position(100,200);
        p.RoomName.style('outline','none');
        p.RoomName.style('border','1px solid #000');
        
        JoinRoom = p.createButton('Join Room');
        JoinRoom.position(75, 300);
        JoinRoom.style('width','145px');
        JoinRoom.style('height','30px');
        JoinRoom.style('border','none');
        //JoinRoom.mouse(function(data){p.cursor(p.HAND);})
        //JoinRoom.mouseOut(function(data){p.cursor(p.ARROW);})
        JoinRoom.mousePressed(function(){
            socket.emit('JoinRoom',p.RoomName.value());
        });
        createRoom = p.createButton('Create Room');
        createRoom.position(225, 300);
        createRoom.style('width','145px');
        createRoom.style('height','30px');
        createRoom.mousePressed(function(){
            socket.emit('CreateRoom',p.RoomName.value());
        });
    }
    p.draw = function(){
        
        p.translate(paddingx,paddingy);
        p.drawGrid();
        p.drawBoard();
        des = p.winner()
        if(des){
            if(des<0){alert('You Lost');}
            if(des>0){alert('You Win');}
        }
    }
    p.drawGrid = function(){
        for(i=0;i<400;i+=100){
            p.line(0,i,300,i);
            p.line(i,0,i,300);
            p.push();
            p.strokeWeight(5);
            p.point(0,i);
            p.point(i,0);
            p.point(300,i);
            p.point(i,300);
            p.pop();
        }
    }

    p.drawBoard = function(){
        for(i=0;i<3;i++){
            for(j=0;j<3;j++){
                x=100*i;y=100*j;
                nx=x+100;ny=y+100;
                if(board[i][j]=='X'){
                    p.line(x+10,y+10,nx-10,ny-10); //  draw "\"
                    p.line(nx-10,y+10,x+10,ny-10); //  draw "/"
                }
                else if(board[i][j]=='O'){
                    p.ellipse(nx-50,ny-50,80);
                }
            }
        }
    }
    p.mousePressed = function(){
        if(!locked){
            i=p.floor((p.mouseX-paddingx)/100);
            j=p.floor((p.mouseY-paddingy)/100);
            if(i<3 && j<3 && i>=0 && j>=0){
                board[i][j]='X';
                coordinates=[i,j]
                data = {room: Cookies.get('room'), msg: coordinates};
                socket.emit('message',data);
                //locked=true;
            }
        }
    }
    p.winner = function(){
        return p.Winner_uti([0,0],[0,1],[0,2])+p.Winner_uti([0,0],[1,0],[2,0])+p.Winner_uti([0,0],[1,1],[2,2])+p.Winner_uti([0,2],[1,1],[2,0])+p.Winner_uti([0,2],[1,2],[2,2])+p.Winner_uti([2,0],[2,1],[2,2])+p.Winner_uti([0,1],[1,1],[2,1])+p.Winner_uti([1,0],[1,1],[1,2]);
    }

    p.Winner_uti = function(x,y,z){
        if(board[x[0]][x[1]]=="X" && board[y[0]][y[1]]=="X" && board[z[0]][z[1]]=="X"){
            return 1;
        }
        else if(board[x[0]][x[1]]=="O" && board[y[0]][y[1]]=="O" && board[z[0]][z[1]]=="O"){
            return -1;
        }
        return 0;
    }

};
