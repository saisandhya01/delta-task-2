let canvas=document.getElementById('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let c=canvas.getContext('2d');
function stopGame(){
    window.location.reload();
 
}
class Wheel{
    constructor(y,startAngle,endAngle,color){
        this.y=y
        this.startAngle=startAngle
        this.endAngle=endAngle
        this.color=color
    }
    draw(){
        c.beginPath()
        c.moveTo(canvas.width/2,this.y)
        c.arc(canvas.width/2,this.y,100,this.startAngle,this.endAngle,false)
        c.fillStyle=this.color
        c.closePath()
        c.fill()
    }
    update(){
        this.startAngle+=0.01;
        this.endAngle+=0.01;
        this.draw()
    }
    drawCircle(){
        c.beginPath()
        c.arc(canvas.width/2,this.y,80,0,Math.PI*2,false)
        c.fillStyle='skyblue'
        c.closePath()
        c.fill()
    }
    getDistance(y1,y2){
        this.y=y1
        let yDistance=y2-this.y
        return Math.sqrt(Math.pow(yDistance,2))
    }
}
class Ball{
    constructor(y,dy,color){
        this.y=y
        this.dy=dy
        this.color=color
    }
    draw(){
        c.beginPath()
        c.arc(canvas.width/2,this.y,10,0,Math.PI*2,false)
        c.fillStyle=this.color
        c.closePath()
        c.fill()
    }
    update(a,b){
        this.y=a;
        this.dy=b;
        this.y+=this.dy;
        
    }
}
var ball=new Ball(canvas.height-40,0,'blue');
//on tap
canvas.onclick=()=>{
   
   ball.update(ball.y,-10);
   
}   

let objects=[];
let y=canvas.height/2-50;
function init(){
    
    for(let i=0;i<10;i++){
      var wheel=new Wheel(y,0,Math.PI/2,'purple');
      objects.push(wheel);
      var wheel1=new Wheel(y,(Math.PI/2),Math.PI,'yellow');
      objects.push(wheel1);
      var wheel2=new Wheel(y,Math.PI,Math.PI/2*3,'blue');
      objects.push(wheel2);
      var wheel3=new Wheel(y,(Math.PI/2*3),Math.PI*2,'pink');
      objects.push(wheel3);
      y-=300;
    }    
}
function drawFrame(){
    c.clearRect(0,0,canvas.width,canvas.height);
    //tapping ball
    ball.draw();
    if(ball.y<canvas.height-40){
    ball.dy+=1;
    ball.update(ball.y,ball.dy);
    }
    //obstacle 1-wheel
    objects.forEach(object => {
        object.update();
        object.drawCircle();
        let b=ball.color;
        let o=object.color;
        /*
        if(object.getDistance(object.y,ball.y)<110){
            if(b.localeCompare(o)===0){
                console.log(ball.color)
            }
        } */
        
        if(ball.y<canvas.height/2+50){
            object.y+=1;
        }
        
    });
    requestAnimationFrame(drawFrame)
}
init()
drawFrame();
