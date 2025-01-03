const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let isGameOver = false;
let gameStarted = false;

let player = {
    x: 50,
    y: canvas.height / 2,
    width: 50,
    height: 30,
    speed: 5,
    color: 'blue',
    velocityY: 0,
    gravity: 0.5
};

let obstacles = [];
let snitches = [];

function createObstacle() {
    let height = Math.random() * 100 + 20;
    let yPosition = Math.random() * (canvas.height - height);
    obstacles.push({ x: canvas.width, y: yPosition, width: 50, height: height });
}

function createSnitch() {
    let yPosition = Math.random() * canvas.height;
    snitches.push({ x: canvas.width, y: yPosition, width: 20, height: 20 });
}

function updatePlayer() {
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
    player.y += player.velocityY;
}

function updateObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.x -= 4;
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(obstacles.indexOf(obstacle), 1);
        }
        if (player.x + player.width > obstacle.x && player.x < obstacle.x + obstacle.width &&
            player.y + player.height > obstacle.y && player.y < obstacle.y + obstacle.height) {
            isGameOver = true;
        }
    });
}

function updateSnitches() {
    snitches.forEach(snitch => {
        snitch.x -= 6;
        if (snitch.x + snitch.width < 0) {
            snitches.splice(snitches.indexOf(snitch), 1);
        }
        if (player.x + player.width > snitch.x && player.x < snitch.x + snitch.width &&
            player.y + player.height > snitch.y && player.y < snitch.y + snitch.height) {
            score += 10;
            snitches.splice(snitches.indexOf(snitch), 1);
        }
    });
}

let keys = {
    up: false,
    down: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') keys.up = true;
    if (e.key === 'ArrowDown') keys.down = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') keys.up = false;
    if (e.key === 'ArrowDown') keys.down = false;
});

function gameLoop() {
    if (isGameOver) {
        gameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.up) player.velocityY = -player.speed;
    else if (keys.down) player.velocityY = player.speed;
    else player.velocityY = 0;

    updatePlayer();

    if (Math.random() < 0.02) createObstacle();
    if (Math.random() < 0.02) createSnitch();

    updateObstacles();
    updateSnitches();

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = 'green';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    ctx.fillStyle = 'gold';
    snitches.forEach(snitch => {
        ctx.beginPath();
        ctx.arc(snitch.x + snitch.width / 2, snitch.y + snitch.height / 2, snitch.width / 2, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 2 - 80, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Final Score: ' + score, canvas.width / 2 - 80, canvas.height / 2 + 30);
    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    score = 0;
    isGameOver = false;
    obstacles = [];
    snitches = [];
    player.y = canvas.height / 2;
    document.getElementById('restartButton').style.display = 'none';
    gameLoop();
}

document.getElementById('restartButton').addEventListener('click', restartGame);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.y = canvas.height / 2;
}

window.addEventListener('resize', resizeCanvas);

function hideInstructions() {
    document.getElementById('instructions').style.display = 'none';
}

setTimeout(hideInstructions, 10000); // Hide instructions after 10 seconds

resizeCanvas();
gameLoop();