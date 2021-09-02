const canvas = document.getElementById('game');
const c = canvas.getContext('2d');

const startV = document.getElementById('start');
const scoreV = document.getElementById('score');
const pointsV = document.getElementById('points');
const startBtn = document.getElementById('gameStart');
const spaceH = document.getElementById('space');

var speed = 2;
var enemyFireRate = 1000;
var life = 3;
var score = 0;
var level = 1;
var step = 10;
var gameStart = false

var shipX = 200;
var shipY = 365;
var shipWingX1 = 204;
var shipWingX2 = 190;
var shipWingX3 = 218;
var shipWingY1 = 350;
var shipWingY2 = 375;
var shipWingY3 = 365;
var shipCockpitX1 = 199;
var shipCockpitX2 = 209;
var shipCockpitY = 355;
var color = ['yellow', 'red', 'orange']
var bulletX = 204;
var bulletY = 355;
var bullets = [];
var enemyBullets = [];

function drawGame(){
    c.clearRect(0, 348, 400, 400);
    drawShip();
    let result = gameOver();
    if(result){
        return;
    }
    countScore();
    setTimeout(drawGame, 50/speed);
    c.clearRect(0, 0, 400, 348);
    c.beginPath();
    c.moveTo(0, 340);
    c.lineTo(400, 340);
    c.closePath();
    c.strokeStyle = 'gray';
    c.stroke();
    bullets.forEach((bullet, index)=>{
        bullet.update();
        if(bullet.y < 0){
            setTimeout(()=>{
                bullets.splice(index, 1);
            }, 0);
        }
    })
    enemies.forEach((enemy, i)=>{
        enemy.update();

        bullets.forEach((bullet, index)=>{
            if(bullet.y >= enemy.y && bullet.y <= enemy.y + 20 && bullet.x >= enemy.x && bullet.x <= enemy.x + 30){
                setTimeout(()=>{
                    enemies.splice(i, 1);
                    bullets.splice(index, 1);
                    score++;
                }, 0);
            }
        })
    })
    enemyBullets.forEach((bullet, index)=>{
        bullet.update();
        if(bullet.y > 400){
            setTimeout(()=>{
                enemyBullets.splice(index, 1);
            }, 0);
        }
        if(bullet.y >= shipWingY1 && bullet.x >= shipWingX2 && bullet.x <= shipWingX3){
            life -= 1;
            setTimeout(()=>{
                enemyBullets.splice(index, 1);
            }, 0);
        }
    })
    if(enemies.length == 0){
        level++;
        enemyFireRate /= 2;
        if(step < 20){
            step += 5
        }
        nextLevel();
    }
}

function drawShip(){
    let col = color[Math.floor(Math.random() * 3)];
    c.fillStyle = 'gray';
    c.fillRect(shipX, shipY, 8, 8)
    c.beginPath();
    c.moveTo(shipWingX1, shipWingY1);
    c.lineTo(shipWingX2, shipWingY2);
    c.lineTo(shipWingX1, shipWingY3);
    c.lineTo(shipWingX3, shipWingY2);
    c.lineTo(shipWingX1, shipWingY1);
    c.closePath();
    c.fill();
    c.strokeStyle = 'gray';
    c.stroke();
    c.beginPath();
    c.moveTo(shipWingX1, shipCockpitY);
    c.lineTo(shipCockpitX1, shipY);
    c.lineTo(shipCockpitX2, shipY);
    c.lineTo(shipWingX1, shipCockpitY);
    c.lineTo(shipWingX1, shipY);
    c.fillStyle = 'white';
    c.fill();
    c.strokeStyle = 'blue';
    c.stroke();
    c.fillStyle = col;
    c.fillRect(shipX, (shipY + 5), 8, 3);
    c.beginPath();
    c.moveTo(shipWingX1, shipCockpitY);
    c.lineTo(shipWingX1, (shipWingY1 - 2));
    c.closePath();
    c.strokeStyle = 'blue';
    c.stroke();

}

class Bullet {
    constructor(x, y, color, v){
        this.x = x
        this.y = y
        this.color = color
        this.v = v
    }
    draw(){
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x, (this.y - 7));
        c.closePath();
        c.strokeStyle = this.color;
        c.stroke();
    }
    update(){
        this.draw();
        this.y -= this.v;
    }
}

class Enemy {
    constructor(xPos, yPos, color, x, yEnd, steps){
        this.x = x
        this.y = -50
        this.color = color
        this.vx = 3
        this.vy = 3
        this.xPos = xPos
        this.yPos = yPos
        this.right = true
        this.yEnd = yEnd
        this.steps = steps
    }
    draw(){
        let col = color[Math.floor(Math.random() * 3)];
        c.fillStyle = this.color
        c.fillRect(this.x, this.y, 30, 20);
        c.fillStyle = col;
        c.fillRect(this.x + 5, this.y - 3, 7, 3);
        c.fillRect(this.x + 18, this.y - 3, 7, 3);
        c.beginPath();
        c.moveTo(this.x, this.y + 20);
        c.lineTo(this.x + 15, this.y + 30);
        c.lineTo(this.x + 30, this.y + 20);
        c.closePath();
        c.strokeStyle = this.color;
        c.stroke();
        c.fillStyle = this.color
        c.fill();
        c.beginPath();
        c.moveTo(this.x + 3, this.y + 10);
        c.lineTo(this.x + 3, this.y + 19);
        c.lineTo(this.x + 13, this.y + 26);
        c.lineTo(this.x + 13, this.y + 10);
        c.lineTo(this.x + 3, this.y + 10);
        c.closePath();
        c.strokeStyle = 'black'
        c.stroke();
        c.fillStyle = 'white'
        c.fill();
        c.beginPath();
        c.moveTo(this.x + 3, this.y + 19);
        c.lineTo(this.x + 13, this.y + 19);
        c.closePath();
        c.strokeStyle = 'black'
        c.stroke();
        c.beginPath();
        c.moveTo(this.x + 17, this.y + 10);
        c.lineTo(this.x + 17, this.y + 26);
        c.lineTo(this.x + 27, this.y + 19);
        c.lineTo(this.x + 27, this.y + 10);
        c.lineTo(this.x + 17, this.y + 10);
        c.closePath();
        c.strokeStyle = 'black'
        c.stroke();
        c.fillStyle = 'white'
        c.fill();
        c.beginPath();
        c.moveTo(this.x + 17, this.y + 19);
        c.lineTo(this.x + 27, this.y + 19);
        c.closePath();
        c.strokeStyle = 'black'
        c.stroke();
        
    }
    update(){
        this.draw();
        if(this.xPos > this.x && this.yPos > this.y){
            this.x += this.vx;
            this.y += this.vy;
        }else if(this.xPos < this.x && this.yPos > this.y){
            this.x -= this.vx;
            this.y += this.vy;
        }else if(this.yPos > this.y){
            this.y += this.vy;
        }else if(this.yPos == this.yEnd && this.x < (this.xPos + 70) && this.right){
            this.x += 1;
            if(this.x == (this.xPos + 70)){
                this.right = false;
                this.y += this.steps;
            }
        }else if(this.yPos == this.yEnd && this.x >= this.xPos){
            this.x -= 1;
            if(this.x == this.xPos){
                this.right = true;
                this.y += this.steps;
            }
        }
    }
}

class EnemyBullet {
    constructor(x, y, color, v){
        this.x = x
        this.y = y
        this.color = color
        this.v = v
    }
    draw(){
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(this.x, this.y - 7);
        c.lineTo(this.x + 1, this.y -7);
        c.lineTo(this.x + 1, this.y);
        c.closePath();
        c.strokeStyle = this.color;
        c.stroke();
    }
    update(){
        this.draw();
        this.y += this.v;
    }
}

var enemies = [
    new Enemy(2, 20, 'red', 2, 20, step),
    new Enemy(75, 20, 'yellow', 75, 20, step),
    new Enemy(150, 20, 'orange', 150, 20, step),
    new Enemy(225, 20, 'green', 225, 20, step),
    new Enemy(300, 20, 'blue', 300, 20, step),
    new Enemy(2, 80, 'red', 2, 80, step),
    new Enemy(75, 80, 'yellow', 75, 80, step),
    new Enemy(150, 80, 'orange', 150, 80, step),
    new Enemy(225, 80, 'green', 225, 80, step),
    new Enemy(300, 80, 'blue', 300, 80, step),
    new Enemy(2, 140, 'red', 2, 140, step),
    new Enemy(75, 140, 'yellow', 75, 140, step),
    new Enemy(150, 140, 'orange', 150, 140, step),
    new Enemy(225, 140, 'green', 225, 140, step),
    new Enemy(300, 140, 'blue', 300, 140, step),
];

setInterval(()=>{
    let random = Math.floor(Math.random() * enemies.length);
    enemyBullets.push(new EnemyBullet(enemies[random].x + 15, enemies[random].y + 30, enemies[random].color, 10));
}, enemyFireRate);

function nextLevel(){
    enemies=[
        new Enemy(2, 20, 'red', 2, 20, step),
        new Enemy(75, 20, 'yellow', 75, 20, step),
        new Enemy(150, 20, 'orange', 150, 20, step),
        new Enemy(225, 20, 'green', 225, 20, step),
        new Enemy(300, 20, 'blue', 300, 20, step),
        new Enemy(2, 80, 'red', 2, 80, step),
        new Enemy(75, 80, 'yellow', 75, 80, step),
        new Enemy(150, 80, 'orange', 150, 80, step),
        new Enemy(225, 80, 'green', 225, 80, step),
        new Enemy(300, 80, 'blue', 300, 80, step),
        new Enemy(2, 140, 'red', 2, 140, step),
        new Enemy(75, 140, 'yellow', 75, 140, step),
        new Enemy(150, 140, 'orange', 150, 140, step),
        new Enemy(225, 140, 'green', 225, 140, step),
        new Enemy(300, 140, 'blue', 300, 140, step),
    ];
}

function gameOver(){
    let gameOver = false;
    enemies.forEach((enemy)=>{
        if(enemy.y + 30 > 340){
            gameOver = true;
        }else if(life == 0){
            gameOver = true;
        }
    })
    if(gameOver){
        scoreV.innerHTML = score;
        startV.style.display = 'block';
        pointsV.style.display = 'block';
        scoreV.style.display = 'block';
        spaceH.style.display = 'none';
        c.clearRect(0, 0, 400, 400);
    }
    
    return gameOver
}

function countScore(){
    c.fillStyle = 'white';
    c.font = '15px Arial';
    c.fillText('Score: ' + score, canvas.width - 60, 395);
    c.fillText('Level: ' + level, canvas.width - 395, 395);
    c.fillText('Shield: ' + life, canvas.width - 220, 395);

}

function init(){
    enemyFireRate = 1000;
    life = 3;
    score = 0;
    level = 1;
    step = 10;
    enemies = [
        new Enemy(2, 20, 'red', 2, 20, step),
        new Enemy(75, 20, 'yellow', 75, 20, step),
        new Enemy(150, 20, 'orange', 150, 20, step),
        new Enemy(225, 20, 'green', 225, 20, step),
        new Enemy(300, 20, 'blue', 300, 20, step),
        new Enemy(2, 80, 'red', 2, 80, step),
        new Enemy(75, 80, 'yellow', 75, 80, step),
        new Enemy(150, 80, 'orange', 150, 80, step),
        new Enemy(225, 80, 'green', 225, 80, step),
        new Enemy(300, 80, 'blue', 300, 80, step),
        new Enemy(2, 140, 'red', 2, 140, step),
        new Enemy(75, 140, 'yellow', 75, 140, step),
        new Enemy(150, 140, 'orange', 150, 140, step),
        new Enemy(225, 140, 'green', 225, 140, step),
        new Enemy(300, 140, 'blue', 300, 140, step),
    ];
    bullets = [];
    enemyBullets = [];
}

canvas.addEventListener('mousemove', (e)=>{
    let result = gameOver();
    if(!result){
        c.clearRect(e.clientX - 10, 348, e.clientX + 18, 400);
    }else{
        c.clearRect(0, 348, 400, 400);
    }
    shipX = e.clientX;
    shipWingX1 = e.clientX + 4;
    shipWingX2 = e.clientX - 10;
    shipWingX3 = e.clientX + 18;
    shipCockpitX1 = e.clientX - 1;
    shipCockpitX2 = e.clientX + 9;
    shipX -= canvas.offsetLeft + 8;
    shipWingX1 -= canvas.offsetLeft + 8;
    shipWingX2 -= canvas.offsetLeft + 8;
    shipWingX3 -= canvas.offsetLeft + 8;
    shipCockpitX1 -= canvas.offsetLeft + 8;
    shipCockpitX2 -= canvas.offsetLeft + 8;
    if(gameStart){
        drawShip();
    }
})

canvas.addEventListener('click', (e)=>{
    bullets.push(new Bullet(e.layerX - 4, bulletY, 'white', 10));
})

startBtn.addEventListener('click', ()=>{
    result = false;
    gameStart = true;
    init();
    drawGame();
    startV.style.display = 'none';
})