let canvas=document.getElementById('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let c=canvas.getContext('2d');
let bestScore=0;
if(typeof(Storage)!=="undefined"){
    if(localStorage.getItem('bestScore')){
        bestScore=Number(localStorage.getItem('bestScore'))
    }
    else{
        localStorage.setItem('bestScore','0');
        bestScore=Number(localStorage.getItem('bestScore'));
    }
}
let colors=['blue','deeppink','yellow','purple'];
let totalScore=0;
let died=false;
let tap=new Audio('sound1.mp3');
let bleep=new Audio('sound2.mp3')
let coordinates=function(dx,dy){
    return {x:dx,y:canvas.height-dy}
}
function returnColor(colors){
    let col=colors[Math.floor(Math.random()*4)];
    return col;
}
function shuffleColor(){
    let colors1=colors;
    let i=colors1.length,k,t;
  while(--i > 0){
    k=Math.floor(Math.random()*(i+1));
      t=colors1[k];
      colors1[k]=colors1[i];
      colors1[i]=t;
  }
  return colors1;

}
let mouse={
    x:0,
    y:0
}
function distance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function score(){
    c.fillStyle='green';
    c.font="bold 20px Arial";
    c.fillText('Score',50,40);
    c.fillText('Best Score',130,40);
    c.fillStyle='white';
    c.font="bold 18px Arial";
    c.fillText(totalScore,75,60);
    c.fillText(bestScore,170,60)
    
}

let obstacle={
    n: 0,
    sep: 350
}
let modAng = function(x){
    var y = x;
    
    while(y < 0){
       console.log(y)
        y += Math.PI*2;
    };
    return y%(Math.PI*2);
};

let stopGame=function(){
    died=true;
    console.log('heelo');
}
let getDist = function(xy1,xy2){
    return {
        d:Math.sqrt(Math.pow(xy1.x-xy2.x,2)+Math.pow(xy1.y-xy2.y,2)),
        a:Math.atan2(xy1.y-xy2.y,xy2.x-xy1.x)
    };
};

let ball={
    co:coordinates(canvas.width/2,canvas.height/4),
    speed:0,
    spdMax:-10,
    color: returnColor(colors),
    draw(){
     c.globalAlpha=1
     c.beginPath()
     c.arc(this.co.x,this.co.y,10,0,Math.PI*2,false)
     c.fillStyle=this.color
     c.closePath()
     c.fill()
    },
    
     update(a,b){

     this.co.y=a;
     this.speed=b;
     this.co.y+=this.speed
     }

    
}
class Switch{
    constructor(y,destroy){
        this.y=100+obstacle.sep*y+obstacle.sep/2
        this.destroy=destroy
    }
    draw(){
        let co=coordinates(canvas.width/2,this.y)
        for(let i=0;i<4;i++){
            let a=i*Math.PI/2
            c.fillStyle=colors[i]
            c.beginPath()
            c.moveTo(co.x,co.y)
            if(getDist(co,ball.co).d<25){
                bleep.play()
                ball.color=returnColor(colors)
                this.destroy=true
            }
            c.arc(co.x,co.y,15,a,a+Math.PI/2,false)
            c.fill()   
        }
        c.closePath()
    }

}
class Star{
    constructor(y,destroy){
        this.y=100+obstacle.sep*y
        this.destroy=destroy
    }
    draw(){
        let co=coordinates(canvas.width/2,this.y)
        c.beginPath()
        for(let i=0;i<=4;i++){
            let angle=i/5*Math.PI*2-Math.PI/2
            let angle2=angle+Math.PI/5
            let r=15
            let r2=0.5*r
            if(getDist(ball.co,co).d< 15){
                bleep.play()
                totalScore+=1;
                this.destroy=true;
                if(totalScore>bestScore){
                    localStorage.setItem('bestScore',totalScore);
                    bestScore=Number(localStorage.getItem('bestScore'));
                }
            }
            c.lineTo(co.x+Math.cos(angle)*r,co.y+Math.sin(angle)*r);
            c.lineTo(co.x+Math.cos(angle2)*r2,co.y+Math.sin(angle2)*r2);
            
        }
        c.fillStyle='white'
        c.closePath()
        c.fill()
    }
}

class Circle {
    constructor(y,radius,col,angle,destroy){
        this.y=100+obstacle.sep*y
        this.radius=radius
        this.col=col
        this.angle=angle
        this.destroy=destroy
            }
    draw(){
        let co=coordinates(canvas.width/2,this.y)
        let speed=0.01
        c.lineWidth=this.radius*15/100
        let w=this.radius*15/100
        for(let j=0;j<4;j++){
            c.beginPath()
            c.strokeStyle=this.col[j]
            let startAngle=modAng(this.angle+Math.PI/2*j)
            let endAngle=modAng(startAngle+Math.PI/2)
            if(this.col[j] != ball.color && !died){
                let dist = getDist(co,ball.co);
                if(dist.d+10 > this.radius-w/2 && dist.d-10 < this.radius+w/2){
                    let pa = modAng(-dist.a);
                    if(pa > startAngle && pa < endAngle){
                        stopGame();
                    };
                };
            };
            
            c.arc(co.x,co.y,this.radius,startAngle,endAngle,false)
            c.stroke()
        }
        this.angle+=speed
    }
}
function playPause(){
    c.beginPath()
    c.fillStyle='grey'
    c.arc(canvas.width-130,30,25,0,Math.PI*2,false)
    c.fill()
    c.closePath()
    if(clickCount%2===0){
        c.beginPath()
        c.strokeStyle='white'
        c.lineWidth=2
        c.moveTo(canvas.width-130-8,20)
        c.lineTo(canvas.width-130-8,40)
        c.moveTo(canvas.width-130+8,20)
        c.lineTo(canvas.width-130+8,40)
        c.stroke()
        c.closePath()
   }
   else{
        c.beginPath()
        c.fillStyle='white'
        c.moveTo(canvas.width-130-8,20)
        c.lineTo(canvas.width-130-8,40)
        c.lineTo(canvas.width-130+8,30)
       c.fill()
       c.closePath()
   }
}

let clickCount=0;
let paused=false;
//on tap
canvas.addEventListener('click',event=>{
    mouse.x=event.offsetX
    mouse.y=event.offsetY
    if(distance(mouse.x,mouse.y,canvas.width-130,30)-25<0){
          clickCount++
          if(clickCount%2!==0){
              paused=true;
          }
          else{
              paused=false;
              requestAnimationFrame(drawFrame);
          }
    }
    else{
    //tap.play()
    ball.speed=ball.spdMax
    ball.update(ball.co.y,ball.speed)
    }
})

let objects=[];
function init(){
    while(obstacle.n<20){
        obstacle.n++;
        let circle=new Circle(obstacle.n,100,shuffleColor(),0,false);
        objects.push(circle);
        let star=new Star(obstacle.n,false);
        objects.push(star);
        let switchC=new Switch(obstacle.n,false);
        objects.push(switchC);
    }
}
function drawFrame(){
    c.clearRect(0,0,canvas.width,canvas.height);
    //tapping ball
    init()
    ball.draw();
    score();
    if(ball.co.y<canvas.height*3/4){
    ball.speed+=1;
    ball.update(ball.co.y,ball.speed);
    }
    objects.forEach(object =>{
        object.draw();
    })
    for(let i = objects.length-1; i >= 0; i--){
        if(objects[i].destroy){
            objects.splice(i,1);
        };
    };
    playPause()
    if(!paused){
    requestAnimationFrame(drawFrame)
    }
}

drawFrame();
