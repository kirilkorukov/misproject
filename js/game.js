// Select the canvas element
const gameCanvas = document.getElementById("my-game");
const gameContext = gameCanvas.getContext("2d");

// Thicker border line for the bricks and the paddle
gameContext.lineWidth = 2;

// Set game variables and constants
const PADDLE_WIDTH = 95;
const PADDLE_MARGIN_BOTTOM = 45;
const PADDLE_HEIGHT = 16;
const PADDLE_SPEED = 5;

const BALL_RADIUS = 7;
const BALL_SPEED = 6;

const BRICK_WIDTH = 55;
const BRICK_HEIGHT = 20;
const BRICK_MARGIN_TOP = 40;
const BRICK_OFFSET_LEFT = 20;
const BRICK_OFFSET_TOP = 20;

let LIFE = 3; // Player will have 3 lives

let SCORE = 0;
const SCORE_UNIT = 5;

let LEVEL = 1;
const MAX_LEVEL = 1;

let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// Create the paddle
const paddle = {
    x : gameCanvas.width/2 - PADDLE_WIDTH/2,
    y : gameCanvas.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width : PADDLE_WIDTH,
    height : PADDLE_HEIGHT,
    dx : PADDLE_SPEED
}

// Draw paddle
function drawPaddle(){
    gameContext.fillStyle = "#29324b";
    gameContext.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Controlling the paddle with keyboard array keys
document.addEventListener("keydown", function(event){
   if(event.keyCode == 37){
       leftArrow = true;
   }else if(event.keyCode == 39){
       rightArrow = true;
   }
});
document.addEventListener("keyup", function(event){
   if(event.keyCode == 37){
       leftArrow = false;
   }else if(event.keyCode == 39){
       rightArrow = false;
   }
});

// Moving the paddle
function movePaddle(){
    if(rightArrow && paddle.x + paddle.width < gameCanvas.width){
        paddle.x += paddle.dx;
    }else if(leftArrow && paddle.x > 0){
        paddle.x -= paddle.dx;
    }
}

// Construct the ball
const ball = {
    x : gameCanvas.width / 2,
    y : paddle.y - BALL_RADIUS,
    radius : BALL_RADIUS,
    speed : BALL_SPEED,
    dx : 3 * (Math.random() * 2 - 1),
    dy : -3
}

// Draw the ball
function drawBall(){
    gameContext.beginPath();
    
    gameContext.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    gameContext.fillStyle = "#ff9b05";
    gameContext.fill();
    
    gameContext.strokeStyle = "#2d354d";
    gameContext.stroke();
    
    gameContext.closePath();
}

// Move the ball
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Ball and wall collision detection
function ballWallCollision(){
    if(ball.x + ball.radius > gameCanvas.width || ball.x - ball.radius < 0){
        ball.dx = - ball.dx;
    }
    
    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
    }
    
    if(ball.y + ball.radius > gameCanvas.height){
        LIFE--; // Lose life if ball is not catched by paddle
        resetBall();
    }
}

// Reset the ball
function resetBall(){
    ball.x = gameCanvas.width/2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// Ball and paddle collision
function ballPaddleCollision(){
    if(ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y){
        
        // Check if the ball hits the paddle
        let collidePoint = ball.x - (paddle.x + paddle.width/2);
        
        // Set the values back to normal
        collidePoint = collidePoint / (paddle.width/2);
        
        // Calculate the angle of the ball
        let angle = collidePoint * Math.PI/3;
            
            
        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}

// Construct the bricks
const brick = {
    row : 1,
    column : 5,
    width : BRICK_WIDTH,
    height : BRICK_HEIGHT,
    offSetLeft : BRICK_OFFSET_LEFT,
    offSetTop : BRICK_OFFSET_TOP,
    marginTop : BRICK_MARGIN_TOP,
    fillColor : "#29324b",
    strokeColor : "#ffffff"
}

let bricks = [];

function createBricks(){
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x : c * ( brick.offSetLeft + brick.width ) + brick.offSetLeft,
                y : r * ( brick.offSetTop + brick.height ) + brick.offSetTop + brick.marginTop,
                status : true
            }
        }
    }
}

createBricks();

// Draw the bricks
function drawBricks(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // If the brick isn't broken
            if(b.status){
                gameContext.fillStyle = brick.fillColor;
                gameContext.fillRect(b.x, b.y, brick.width, brick.height);
                
                gameContext.strokeStyle = brick.strokeColor;
                gameContext.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// Ball brick collision
function ballBrickCollision(){
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            // If the brick isn't broken
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    ball.dy = - ball.dy;
                    b.status = false; // The brick is broken
                    SCORE += SCORE_UNIT; // Update score
                }
            }
        }
    }
}

// Show game stats
function showGameStats(text, textX, textY, img, imgX, imgY){
    // Draw text
    gameContext.fillStyle = "#ffffff";
    gameContext.font = "25px sans-serif";
    gameContext.fillText(text, textX, textY);
    
    // Draw image
    gameContext.drawImage(img, imgX, imgY, width = 25, height = 25);
}

// The draw funcion
function draw(){
    drawPaddle();
    
    drawBall();
    
    drawBricks();
    
    // Show score
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    
    // Show lives
    showGameStats(LIFE, gameCanvas.width - 25, 25, LIFE_IMG, gameCanvas.width - 55, 5); 
    
    // Show level
    showGameStats(LEVEL, gameCanvas.width / 2, 25, LEVEL_IMG, gameCanvas.width / 2 - 30, 5);
}

// Game over
function gameOver(){
    if(LIFE <= 0){
        showLose();
        GAME_OVER = true;
    }
}

// Level up
function levelUp(){
    let isLevelDone = true;
    
    // Check if all the bricks are broken
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && ! bricks[r][c].status;
        }
    }
    
    if(isLevelDone){
        if(LEVEL >= MAX_LEVEL){
            showWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

// Update game function
function update(){
    movePaddle();
    
    moveBall();
    
    ballWallCollision();
    
    ballPaddleCollision();
    
    ballBrickCollision();
    
    gameOver();
    
    levelUp();
}

// Show GAME OVER message
/* Select elements */
const gameover = document.getElementById("gameover");
const win = document.getElementById("win");
const lose = document.getElementById("lose");
const restart = document.getElementById("restart");

// Click on PLAY AGAIN button
restart.addEventListener("click", function(){
    location.reload(); // reload the page
})

// Show you win
function showWin(){
    gameover.style.display = "block";
    won.style.display = "block";
}

// Show you lose
function showLose(){
    gameover.style.display = "block";
    lose.style.display = "block";
}

// Game loop
function loop(){
    // Clear the canvas
    gameContext.drawImage(BACKGROUND_IMG, 0, 0);
    
    draw();
    
    update();
    
    if(! GAME_OVER){
        requestAnimationFrame(loop);
    }
}

// Start the game
function start() {
    loop();
}

start();