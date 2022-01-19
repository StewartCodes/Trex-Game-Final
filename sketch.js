var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var obstacleImgs
var gameState
var obstaclesGroup, cloudsGroup, pterodactylGroup
var score
var jumpSound
var dieSound
var checkpointSound
var gameTime



var score;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  cloudImg = loadImage("cloud.png");
  obstacleImg1 = loadImage("obstacle1.png");
  obstacleImg2 = loadImage("obstacle2.png");
  obstacleImg3 = loadImage("obstacle3.png");
  obstacleImg4 = loadImage("obstacle4.png");
  obstacleImg5 = loadImage("obstacle5.png");
  obstacleImg6 = loadImage("obstacle6.png");
  groundImage = loadImage("ground2.png");
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  pterodactylAnimation = loadAnimation("pterodactyl1.png", "pterodactyl2.png")
  


  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkpointSound = loadSound("checkpoint.mp3")
}

function setup() {

  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("rectangle", 0, 0, 90, 100);
  // trex.setCollider("circle", 0, 0, 55);

  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -6;
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  gameState = "playing"
  obstaclesGroup = new Group();
  pterodactylGroup = new Group();
  cloudsGroup = new Group();

  restart = createSprite(300, 100, 100, 100)
    restart.addImage(restartImg)
    restart.visible = false
    restart.scale = 0.5

    gameOver = createSprite(300, 40, 100, 100)
    gameOver.addImage(gameOverImg)
    gameOver.visible = false
    gameOver.scale = 0.75

  score = 0
  gameTime = "day";

  
  
 

  obstacleImgs = [obstacleImg1, obstacleImg2, obstacleImg3, obstacleImg4, obstacleImg5, obstacleImg6]
}

function draw() {
  //set background color

  if (gameTime === "day"){
    background("white")
  } else {
    background("grey")
  }

 // noStroke();
  fill("black")
  text("Score : " + score, 25, 25)

  trex.velocityY = trex.velocityY + 0.8
  
  if (score % 50 === 0 && score > 0){
    changeTime()
  }

  if (gameState === "playing"){
        // jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 145) {
      jumpSound.play()
      trex.velocityY = -10;
    }

    if (trex.isTouching(obstaclesGroup) || trex.isTouching(pterodactylGroup)){
     gameState = "Over"
     dieSound.play()
    }

    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    if (frameCount % 120 === 0){
      spawnClouds()
    }

    if (frameCount % 60 === 0){
      if (score > 500){
        var rand = Math.round(random(1,5))
        switch(rand){
          case 1:
            spawnPterodactyl()
            break;
          case 2:
            spawnObstacles()
            break; 
          case 3:
            spawnObstacles()
            break;
          case 4:
            spawnObstacles()
            break;
          default:
            break
        }
      } else if (Math.round(random(1,2)) === 2){
        spawnObstacles()
      }
    }

    if (frameCount % 3 === 0){
      score += 1
    }

    if (score % 100 === 0 && score != 0){
      checkpointSound.play()
    }
  } else {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach (0)
    obstaclesGroup.setLifetimeEach (-1)
    pterodactylGroup.setVelocityXEach (0)
    pterodactylGroup.setLifetimeEach (-1)
    cloudsGroup.setVelocityXEach (0)
    cloudsGroup.setLifetimeEach (-1)
    restart.visible = true
    gameOver.visible = true
    if (mousePressedOver(restart)){
      reset();
    }
  }
    //stop trex from falling down
    trex.collide(invisibleGround);
    //console.log(frameCount)
    drawSprites();
}


function reset(){

    gameState = "playing";
    obstaclesGroup.destroyEach();
    pterodactylGroup.destroyEach();
    cloudsGroup.destroyEach();
    restart.visible = false
    gameOver.visible = false
    ground.velocityX = -6.75
    score = 0
}

//function to spawn the clouds
function spawnClouds(){
  cloud = createSprite(650, Math.round(random(15,100)), 10, 10)
  cloud.scale = (0.625)
  cloud.velocityX = -2
  cloud.addImage(cloudImg) 
 trex.depth = (cloud.depth + 1)
 cloud.lifetime = (300)
 cloudsGroup.add (cloud)
}

//function to spawn the obstacles
function spawnObstacles(){
  obstacle = createSprite(650, 165, 10, 10)
  obstacle.scale = (0.5)
  obstacle.velocityX = -6.75
  var rand = Math.round(random(0,5))

  obstacle.addImage(obstacleImgs[rand]) 
  obstacle.lifetime = (300)
  obstaclesGroup.add (obstacle)


  // switch(rand){
  //   case 1:
  //     obstacle.addImage(obstacleImg1);
  //     break; 
  //   case 2:
  //     obstacle.addImage(obstacleImg2);
  //     break; 
  //   case 3:
  //     obstacle.addImage(obstacleImg3);
  //     break; 
  //   default:
  //     break
  // }

}

function spawnPterodactyl(){
  pterodactyl = createSprite(650, 100, 10, 10)
  pterodactyl.scale = (0.25)
  pterodactyl.velocityX = -6.75
  pterodactyl.lifetime = (300)
  pterodactyl.addAnimation("flying", pterodactylAnimation);
  pterodactylGroup.add (pterodactyl)
}

function changeTime(){
  if (gameTime === "day"){
    gameTime = "night"
  } else {
    gameTime = "day"
  }
}