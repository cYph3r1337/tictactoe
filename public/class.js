// The ball Class
class Puck {
    constructor(){
        this.x=w/2;
        this.y=h/2;
        this.xspeed=random(10,-10);
        this.yspeed=random(10,-10);
    }
    show(){
        circle(this.x,this.y,20);
    }
    update(){
        this.x+=this.xspeed;
        this.y+=this.yspeed;
    }
    reset(){
        this.x=w/2;
        this.y=h/2;
        this.xspeed=random(10,-10);
        this.yspeed=random(10,-10);
    }
    isOk(){
        if(this.y>h || this.y<0){
            this.yspeed = -this.yspeed;
        } 
        if(this.x>w){
            this.reset();
        }
        if(this.x<0){
            this.reset();
        }
    }
    ishit(X,Y){
        if ((this.x+20>X-5||this.x+20>X+5) && (this.y>Y-50 && this.y<Y+50)){
            this.xspeed = -this.xspeed;
        }
    }
}

// The pads class
class pads{
    constructor(X,Y,padd){
        this.x=X;
        this.y=Y;
        this.padding=padd;
    }
    show(){
        rect(this.x+this.padding, this.y-100, 10, 100, 20);
    }
    move(){
        this.y = map(mouseY,0,h,100,h);
        return [this.x,this.y];
    }
}
