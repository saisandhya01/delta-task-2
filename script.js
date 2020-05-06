let canvas=document.getElementById('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let c=canvas.getContext('2d');

//to stop the game when the ball hits the wrong color
function stopGame(){
    window.location.reload();
}
let totalScore=0;
let colors=['purple','deeppink','yellow','blue'];

//function to display the score
function score(){
    c.fillStyle='green';
    c.font="bold 30px Arial";
    c.fillText('Score',50,40);
    c.fillStyle='white';
    c.font="bold 25px Arial";
    c.fillText(totalScore,83,80);
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
        c.fillStyle='black'
        c.closePath()
        c.fill()
    }
    
}
class Ball{
    constructor(y,dy,color){
        this.y=y
        this.dy=dy
        this.color=color
    }
    draw(){
        c.globalAlpha=1
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
function collisionDetection(a,b,c,d){
    if(a>c && a<b){
        let colorBall=ball.color;
        let colorWheel=d;
        if(colorBall.localeCompare(colorWheel)===0){
            return false;
        }
        else{
            console.log('is this working?')
            return true;
        }
    }
    else{
        return false;
    }
    
} 

let objects=[];
let y=canvas.height/2-50;
function init(){
    
    for(let i=0;i<1;i++){
      var wheel=new Wheel(y,0,Math.PI/2,'purple');
      objects.push(wheel);
      var wheel1=new Wheel(y,(Math.PI/2),Math.PI,'yellow');
      objects.push(wheel1);
      var wheel2=new Wheel(y,Math.PI,Math.PI/2*3,'blue');
      objects.push(wheel2);
      var wheel3=new Wheel(y,(Math.PI/2*3),Math.PI*2,'deeppink');
      objects.push(wheel3);
    
    }    
}

function drawFrame(){
    c.clearRect(0,0,canvas.width,canvas.height);
    //score
    score();
    //tapping ball
    ball.draw();
    if(ball.y<canvas.height-40){
    ball.dy+=1;
    ball.update(ball.y,ball.dy);
    }
    //obstacles
    objects.forEach(object => {
        object.update();
        object.drawCircle();
        /*
        if(ball.y<canvas.height/2+50){
            object.y+=1;
        }
        */
       if(collisionDetection(ball.y-10,object.y+100,object.y-100,object.color)){
           stopGame();
       }
    });
    requestAnimationFrame(drawFrame)
}
init()
drawFrame();
