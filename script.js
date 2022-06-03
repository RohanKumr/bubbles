//canvas setup
const canvas = document.getElementById("Canvas");
const restart = document.getElementById("restart");

const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
let playAudio = false;
let gameSpeed = 1;
let gameOver = false;
let mute = false;
let reset = false;
ctx.font = "30px Georgia";
ctx.fillStyle = "white";

//SOUND /Effects
const crunch = document.createElement("audio");
crunch.src = "mixkit-chewing-something-crunchy-2244.wav";
crunch.duration = 300;
crunch.volume = 0.1;
const explosion1 = document.createElement("audio");
explosion1.src = "explosion1.ogg";
explosion1.duration = 300;
explosion1.volume = 0.1;
const music = document.createElement("audio");
music.volume = 0.1;
music.src = "Fight Amidst the Destruction -shortloop.mp3";
music.loop = true;

const gameOverSound = document.createElement("audio");
gameOverSound.src = "gameover-sad.wav";
gameOverSound.volume = 0.1;

//BACKGROUNDS
const Background = new Image();
Background.src = "water.png";

const BG = {
  x1: 0,
  x2: canvas.width,
  y: 0,
  height: canvas.height,
  width: canvas.width,
};
function handleBackground() {
  BG.x1 -= gameSpeed;
  if (BG.x1 < -BG.width) BG.x1 = BG.width;
  BG.x2 -= gameSpeed;
  if (BG.x2 < -BG.width) BG.x2 = BG.width;
  ctx.drawImage(Background, BG.x1, BG.y, BG.width, BG.height);
  ctx.drawImage(Background, BG.x2, BG.y, BG.width, BG.height);
}

//ICONS
let BubbleIcon = new Image();
BubbleIcon.src = "bubble-256px.png";

let Water = new Image();
Water.src = "water.png";

//Mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  click: false,
  interacted: false,
};

canvas.addEventListener("mousedown", function (e) {
  mouse.click = true;
  mouse.interacted = true;
  if (playAudio === false) {
    music.play();
  }
  playAudio = true;
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
  //for mute
  if (mouse.y < 60 && mouse.x > 720) {
    mute = !mute;
  }
});
canvas.addEventListener("mouseup", function (e) {
  mouse.click = false;
});

//Player
const playerImage = new Image();
playerImage.src = "hero.png";

class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height / 2;
    this.radius = 40;
    this.angle = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
    this.sound = "sound";
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    // let theta = Math.atan2(dy, dx);
    // console.log({ theta });
    // this.angle = theta;
    if (mouse.x != this.x) this.x -= dx / 20;
    if (mouse.y != this.y) this.y -= dy / 20;
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame > 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
  }
  draw() {
    if (mouse.click) {
      //   ctx.lineWidth = 0.2;
      //   ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      //   ctx.lineTo(mouse.x, mouse.y);
      //   ctx.stroke();
    }
    // ctx.fillStyle = "white";
    ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.drawImage(PlayerImage, this.x - 76, this.y - 50, 148, 100);
    //ghost
    ctx.save();
    // ctx.translate(this.x, this.y);
    // ctx.rotate(this.angle);
    ctx.drawImage(
      playerImage,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 50,
      this.y - 40,
      this.spriteWidth / 4.5,
      this.spriteHeight / 4.5
    );
    ctx.restore();
  }
}
const player = new Player();

// BUBBLE
const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.image = BubbleIcon;
    this.sound = Math.random() <= 0.5 ? "sound1" : "sound2";
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx * dx + dy * dy);
  }

  draw() {
    // ctx.fillStyle = "blue";
    ctx.beginPath();
    // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    ctx.closePath();
    ctx.drawImage(this.image, this.x - 50, this.y - 50, 100, 100);
    ctx.stroke();
  }
}

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
      i--;
    }
    if (bubblesArray[i]) {
      if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
        crunch.pause();
        explosion1.pause();
        crunch.load();
        explosion1.load();

        if (bubblesArray[i].sound == "sound1") {
          crunch.play();
        } else {
          explosion1.play();
        }
        bubblesArray.splice(i, 1);
        i--;
        score++;
      }
    }
  }
}

const enemies = [];
const enemyImage = new Image();
enemyImage.src = "enemy.png";
const enemyImage2 = new Image();
enemyImage2.src = "enemy-green.png";
const enemyImage3 = new Image();
enemyImage3.src = "enemy-orange.png";
const enemyImage4 = new Image();
enemyImage4.src = "enemy-pink.png";
const enemyImage5 = new Image();
enemyImage5.src = "enemy-red.png";
const enemyImage6 = new Image();
enemyImage6.src = "enemy-yellow.png";
enemies.push(
  enemyImage,
  enemyImage2,
  enemyImage3,
  enemyImage4,
  enemyImage5,
  enemyImage6
);
class Enemy {
  constructor() {
    this.x = canvas.width + 200;
    this.y = Math.random() * (canvas.height - 150) + 90;
    this.radius = 45;
    this.speed = Math.random() * 2 + 1;
    this.frame = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.image = enemies[Math.floor(Math.random() * enemies.length)];
    this.spriteWidth = 418;
    this.spriteHeight = 397;
  }
  draw() {
    // ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    // ctx.fill();
    ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      this.frameY * this.spriteHeight,
      this.spriteWidth,
      this.spriteHeight,
      this.x - 50,
      this.y - 60,
      this.spriteWidth / 3.5,
      this.spriteHeight / 3.5
    );
  }
  update() {
    this.x -= this.speed;
    if (this.x < 0 - this.radius * 2) {
      this.x = canvas.width + 200;
      this.y = Math.random() * (canvas.height - 150) + 90;
      this.speed = Math.random() * 2 + 1;
    }
    if (gameFrame % 5 == 0) {
      this.frame++;
      if (this.frame > 12) this.frame = 0;
      if (this.frame == 3 || this.frame == 7 || this.frame == 11) {
        this.frameX = 0;
      } else {
        this.frameX++;
      }
      if (this.frame < 3) this.frameY = 0;
      else if (this.frame < 7) this.frameY = 1;
      else if (this.frame < 11) this.frameY = 2;
      else this.frameY = 0;
    }
    //collision
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < this.radius + player.radius) handleGameover();
  }
}
const randomEnemy = new Enemy(
  enemies[Math.floor(Math.random() * enemies.length)]
);

const enemiesArray = [new Enemy()];
function handleEnemies() {
  if (gameFrame % 250 == 0) {
    enemiesArray.push(new Enemy());
  }
  for (let i = 0; i < enemiesArray.length; i++) {
    enemiesArray[i].update();
    enemiesArray[i].draw();
    if (enemiesArray[i].x < 0) {
      enemiesArray.splice(i, 1);
    }
  }
}

function handleGameover() {
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER", 130, 200);
  ctx.fillText("SCORE: " + score, 130, 250);
  gameOver = true;
  gameOverSound.pause();
  gameOverSound.load();
  gameOverSound.play();
  music.pause();

  reset = true;
  if (reset) {
    restart.style.visibility = "visible";
  }
}

function handleMute() {
  const muteIcon = new Image();
  muteIcon.src = "mute.png";
  const soundOn = new Image();
  soundOn.src = "sound-on.png";
  if (mute) {
    music.pause();
    crunch.pause();
    explosion1.pause();
    gameOverSound.pause();
    ctx.drawImage(muteIcon, 750, 10, 35, 35);
  } else {
    if (!gameOver && mouse.interacted) {
      music.play();
      ctx.drawImage(soundOn, 750, 10, 35, 35);
    }
  }
}
// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleBackground();
  handleBubbles();
  player.draw();
  player.update();
  handleEnemies();
  handleMute();
  ctx.fillText("score: " + score, 10, 30);
  gameFrame++;
  if (!gameOver) {
    gameOverSound.pause();
    requestAnimationFrame(animate);
  }
}
animate();

restart.addEventListener("mousedown", function (e) {
  // restart.getElementById("restart").removeE/ventListener("click");
  if (reset) {
    score = 0;
    gameOver = false;
    gameFrame = 0;
    console.log({ score, gameFrame, playAudio, gameSpeed, gameOver, reset });
    bubblesArray.splice(0, bubblesArray.length);
    enemiesArray.splice(0, enemiesArray.length);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animate();
  }
  restart.style.visibility = "hidden";
  reset = false;
});
