let canvas=document.getElementById('canvas');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let c=canvas.getContext('2d');

let bestScore=0;
let bestScore1=0;
if(typeof(Storage)!=="undefined"){
    if(localStorage.getItem('bestScore')){
        bestScore=Number(localStorage.getItem('bestScore'))
    }
    else{
        localStorage.setItem('bestScore','0');
        bestScore=Number(localStorage.getItem('bestScore'));
    }
    if(localStorage.getItem('bestScore1')){
        bestScore1=Number(localStorage.getItem('bestScore1'))
    }
    else{
        localStorage.setItem('bestScore1','0');
        bestScore1=Number(localStorage.getItem('bestScore1'));
    }
}

let colors=['blue','deeppink','yellow','purple'];
let totalScore=0;
let totalScore1=0;
let died=false;
let died1=false;
let tap=new Audio('sound1.mp3');
let bleep=new Audio('sound2.mp3')
let moveY=0
let moveY1=0
let coordinates=function(dx,dy,s){
    return {x:dx,y:canvas.height-dy+s}
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
    c.fillStyle='green';
    c.font="bold 20px Arial";
    c.fillText('Score',canvas.width/2+50,40);
    c.fillText('Best Score',canvas.width/2+130,40);
    c.fillStyle='white';
    c.font="bold 18px Arial";
    c.fillText(totalScore1,canvas.width/2+75,60);
    c.fillText(bestScore1,canvas.width/2+170,60)
    
}

let obstacle={
    n: 0,
    sep: 350
}
let modAng = function(x){
    var y = x;
    
    while(y < 0){
    
        y += Math.PI*2;
    };
    return y%(Math.PI*2);
};

let stopGame=function(){
    died=true;
    console.log('it has collided the wrong color');
}
let stopGame1=function(){
    died1=true;
    console.log('it has collided the wrong color');
}

let getDist = function(xy1,xy2){
    return {
        d:Math.sqrt(Math.pow(xy1.x-xy2.x,2)+Math.pow(xy1.y-xy2.y,2)),
        a:Math.atan2(xy1.y-xy2.y,xy2.x-xy1.x)
    };
};

class Ball{
    constructor(x,color,k){
        this.x=x
        this.y=40
        this.k=k
        if(this.k===0){
           this.co=coordinates(this.x,this.y,moveY)
        }
        else{
            this.co=coordinates(this.x,this.y,moveY1)
        }
        this.color=color
        this.speed=0
        this.spdMax=-10
    }
    draw(){
        c.globalAlpha=1
        c.beginPath()
        c.arc(this.co.x,this.co.y,10,0,Math.PI*2,false)
        c.fillStyle=this.color
        c.closePath()
        c.fill()
    }
    update(a,b){

        this.co.y=a;
        this.speed=b;
        this.co.y+=this.speed
    }
}   

class Switch{
    constructor(x,y,k){
        this.x=x
        this.y=100+obstacle.sep*y+obstacle.sep/2
        this.destroy=false
        this.k=k
    }
    draw(){
        let co;
        if(this.k===0){
           co=coordinates(this.x,this.y,moveY)
        }
        else{
            co=coordinates(this.x,this.y,moveY1)
        }
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
            if(getDist(co,ball1.co).d<25){
                bleep.play()
                ball1.color=returnColor(colors)
                this.destroy=true
            }
            c.arc(co.x,co.y,15,a,a+Math.PI/2,false)
            c.fill()   
        }
        c.closePath()
    }

}
class Star{
    constructor(x,y,k){
        this.x=x
        this.y=100+obstacle.sep*y
        this.destroy=false
        this.k=k
    }
    draw(){
        let co;
        if(this.k===0){
           co=coordinates(this.x,this.y,moveY)
        }
        else{
            co=coordinates(this.x,this.y,moveY1)
        }
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
            if(getDist(ball1.co,co).d< 15){
                bleep.play()
                totalScore1+=1;
                this.destroy=true;
                if(totalScore1>bestScore1){
                    localStorage.setItem('bestScore1',totalScore1);
                    bestScore1=Number(localStorage.getItem('bestScore1'));
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
class Rectangle{
    constructor(x,y,k){
        this.color=shuffleColor()
        this.y=100+obstacle.sep*y
        this.x=x-200
        this.chk=x
        this.k=k
        this.destroy=false
    }
    draw(){
        let co;
        if(this.k===0){
           co=coordinates(this.x,this.y,moveY)
        }
        else{
            co=coordinates(this.x,this.y,moveY1)
        }
        for(let i=0;i<4;i++){
            c.beginPath()
            c.fillStyle=this.color[i];
            if(this.color[i]!=ball.color && ball.color!='white' && !died){
                if(this.x+100*i>=this.chk-100 && this.x+100*i<=this.chk){
                if(ball.co.y-10<co.y+20){
                    stopGame();
                    console.log('wrong color');
                }
            } }
            if(this.color[i]!=ball1.color && ball1.color!='white' && !died1){
                if(this.x+100*i>=this.chk-100 && this.x+100*i<=this.chk){
                if(ball1.co.y-10<co.y+20){
                    stopGame1();
                    console.log('wrong color');
                }
            } }
            
            c.rect(this.x+100*i,co.y,100,20);
            c.fill();
            c.closePath()
        }
        this.x-=3;
        if(this.x<this.chk-400){
            this.x=this.chk+100;
        }
    }
}
class Circle {
    constructor(x,y,radius,col,angle,dir,k){
        this.y=100+obstacle.sep*y
        this.radius=radius
        this.col=col
        this.x=x
        this.angle=angle
        this.destroy=false
        this.dir=dir
        this.k=k
            }
    draw(){
        let co;
        if(this.k===0){
           co=coordinates(this.x,this.y,moveY)
        }
        else{
            co=coordinates(this.x,this.y,moveY1)
        }
        let speed=0.01*this.dir
        c.lineWidth=this.radius*15/100
        let w=this.radius*15/100
        for(let j=0;j<4;j++){
            c.beginPath()
            c.strokeStyle=this.col[j]
            let startAngle=modAng(this.angle+Math.PI/2*j)
            let endAngle=modAng(startAngle+Math.PI/2)
            if(this.col[j] != ball.color && !died && ball.color!='white'){
                let dist = getDist(co,ball.co);
                if(dist.d+10 > this.radius-w/2 && dist.d-10 < this.radius+w/2){
                    let ca = modAng(-dist.a);
                    if(ca > startAngle && ca < endAngle){
                        stopGame();
                    };
                };
            };
            if(this.col[j] != ball1.color && !died1 && ball1.color!='white'){
                let dist = getDist(co,ball1.co);
                if(dist.d+10 > this.radius-w/2 && dist.d-10 < this.radius+w/2){
                    let ca = modAng(-dist.a);
                    if(ca > startAngle && ca < endAngle){
                        stopGame1();
                    };
                };
            };
            
            c.arc(co.x,co.y,this.radius,startAngle,endAngle)
            c.stroke()
        }
        this.angle+=speed
    }
}
function sepLine(){
    c.beginPath()
    c.moveTo(canvas.width/2,0)
    c.strokeStyle='white'
    c.lineTo(canvas.width/2,canvas.height)
    c.stroke()
    c.closePath()
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

let coinImage=new Image();
coinImage.src='spritesheet.png';
let frameIndex=0
let noOfFrames=10
function sprite(option){
    let object={}
    object.width=option.width
    object.height=option.height
    object.image=option.image
    object.srcX=0
    object.k=option.k
    object.x=option.x
    object.y=100+obstacle.sep*option.y+obstacle.sep/2
    object.destroy=false
    object.draw=function(){
        let co;
        if(object.k===0){
            co=coordinates(object.x,object.y,moveY)
        }
        else{
            co=coordinates(object.x,object.y,moveY1)
        }
        if(Math.sqrt(Math.pow(co.y-ball.co.y,2))<object.height){
            if(co.x===canvas.width/4-50){
                ball.color='white'
                object.destroy=true
        } }
        if(Math.sqrt(Math.pow(co.y-ball1.co.y,2))<object.height){
            if(co.x===canvas.width*3/4-50){
                ball1.color='white'
                 object.destroy=true
            }
        }
        c.drawImage(
           object.image,
           object.srcX,
           0,
           100,
           100,
           co.x,
           co.y,
           object.width,
           object.height
        )
        object.update()
    }
    object.update=function(){
        frameIndex=++frameIndex % noOfFrames
        object.srcX=frameIndex*object.width
    }
    return object
}

function restartMessage(W){
    c.beginPath()
    c.globalAlpha = 0.7;
    c.fillStyle = '#000';
    if(W===canvas.width/4){
        c.fillRect(0,0,2*W,canvas.height); }
    else{
        c.fillRect(canvas.width/2,0,2*W/3,canvas.height);
    }
    c.globalAlpha = 1;
    c.fillStyle = '#000';
    c.strokeStyle = '#EEE';
    c.lineWidth = 2;
    if(W===canvas.width/4){
    c.fillText('TAP ENTER TO',W,canvas.height/2);
    c.strokeText('TAP ENTER TO',W,canvas.height/2);
    }
    else{
        c.fillText('TAP SPACE TO',W,canvas.height/2);
        c.strokeText('TAP SPACE TO',W,canvas.height/2); 
    }
    c.fillText('RESTART',W,canvas.height/2+50);
    c.strokeText('RESTART',W,canvas.height/2+50);
    c.closePath()
}
let clickCount=0;
let paused=false;
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
    
})
let ballC=returnColor(colors)
let ball=new Ball(canvas.width/4,ballC,0);
let ball1=new Ball(canvas.width*3/4,ballC,1);
window.addEventListener('keydown',event=>{
    let keyPressed=event.keyCode
    if(keyPressed===83){
        moveY+=5;
        ball.speed=ball.spdMax;
        ball.update(ball.co.y,ball.speed);
    }
    if(keyPressed===76){
        moveY1+=5;
        ball1.speed=ball1.spdMax;
        ball1.update(ball1.co.y,ball1.speed);
    }
    if(keyPressed===13){
        died=false
        totalScore=0
        ball.spdMax=-10
    }
    if(keyPressed===32){
        died1=false
        totalScore1=0
        ball1.spdMax=-10
    }
})

let objects=[];
let randomP=Math.floor(Math.random()*20);
console.log(randomP)
function init(){
    while(obstacle.n<20){
        obstacle.n++;
        let random=Math.floor(Math.random()*3);
        switch(random){
        case 0:
           let circle=new Circle(canvas.width/4,obstacle.n,100,shuffleColor(),0,1,0);
           let circle1=new Circle(canvas.width*3/4,obstacle.n,100,shuffleColor(),0,1,1);
           objects.push(circle,circle1);
           break;
        case 1:
           let recta=new Rectangle(canvas.width/4,obstacle.n,0);
           let recta1=new Rectangle(canvas.width*3/4,obstacle.n,1);
           objects.push(recta,recta1);
           break;
        case 2:
           let col=shuffleColor();
           let c1=new Circle(canvas.width/4,obstacle.n,100,col,0,1,0);
           let c2=new Circle(canvas.width*3/4,obstacle.n,100,col,0,1,1);
           objects.push(c1,c2);
           let c3=new Circle(canvas.width/4,obstacle.n,50,col,0,-1,0);
           let c4=new Circle(canvas.width*3/4,obstacle.n,50,col,0,-1,1);
           objects.push(c3,c4);
           break;
        
        };
        let star=new Star(canvas.width/4,obstacle.n,0);
        let star1=new Star(canvas.width*3/4,obstacle.n,1);
        objects.push(star,star1);
        if(randomP===obstacle.n){
            let coin=sprite({
                width: 100,
                height: 50,
                x: canvas.width/4-50,
                y: obstacle.n,
                k:0,
                image: coinImage
            })
            let coin1=sprite({
                width: 100,
                height: 50,
                x: canvas.width*3/4-50,
                y: obstacle.n,
                k:1,
                image: coinImage
            })
            objects.push(coin,coin1)
          
        }
        else{
          let switchC=new Switch(canvas.width/4,obstacle.n,0);
          let switchC1=new Switch(canvas.width*3/4,obstacle.n,1);
          objects.push(switchC,switchC1);
        }
    }
}

function drawFrame(){
    c.clearRect(0,0,canvas.width,canvas.height);
    //tapping ball
    init()
    ball.draw();
    ball1.draw();
    score();
    if(ball.co.y<canvas.height-40){
    ball.speed+=1;
    ball.update(ball.co.y,ball.speed);
    }
    if(ball1.co.y<canvas.height-40){
        ball1.speed+=1;
        ball1.update(ball1.co.y,ball1.speed);
    }
    objects.forEach(object =>{
        object.draw();
        
    })
    for(let i = objects.length-1; i >= 0; i--){
        if(objects[i].destroy){
            objects.splice(i,1);
        };
    };
    if(died){
        restartMessage(canvas.width/4)
        ball.spdMax=0
        moveY=0
    }
    if(died1){
        restartMessage(canvas.width*3/4)
        ball1.spdMax=0
        moveY1=0
    }
    sepLine()
    playPause()
    if(!paused){
    requestAnimationFrame(drawFrame)
    }
}

drawFrame();
 