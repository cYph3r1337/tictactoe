const express = require('express');
const app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
var path = require('path');
var RoomName = [];
app.use(express.static(__dirname + '/public'));
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname + '/public/main.html'));
})

app.listen(3000);
server.listen(2000); // websocket port
console.log('Server Started');
io.sockets.on('connection',newConnection);

function newConnection(socket){
    socket.on("CreateRoom", function(data){
        if(RoomName.indexOf(data)<0){
            RoomName.push(data);
            socket.join(data);
            io.to(socket.id).emit('execute', "alert('You Joined room -"+data+"');Cookies.set('room', '"+data+"')");
        }
        else{
            io.to(socket.id).emit('execute', 'alert("Room Name Already Taken");');
        }
    });
    socket.on("JoinRoom",function(data){
        if(RoomName.indexOf(data)>=0){
            if(io.sockets.adapter.rooms[data].length<2){
                socket.join(data);
            }
        }
    });
    socket.on("message",function(data){
        socket.broadcast.to(data.room).emit('message',data.msg);
    })
    console.log("User Connected - ", socket.id);
}