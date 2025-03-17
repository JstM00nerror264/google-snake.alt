const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const rows = canvas.height / tileSize;
const cols = canvas.width / tileSize;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let gameOver = false;
let countdown = 3;
let gameStarted = false;
let moveInterval;

document.addEventListener('keydown', (event) => {
    if (!gameStarted) return;

    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }

    if (!moveInterval) {
        moveInterval = setInterval(update, 100);
    }
});

canvas.addEventListener('click', (event) => {
    if (!gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const head = snake[0];
    const targetX = Math.floor(mouseX / tileSize);
    const targetY = Math.floor(mouseY / tileSize);

    if (targetX > head.x) {
        direction = { x: 1, y: 0 };
    } else if (targetX < head.x) {
        direction = { x: -1, y: 0 };
    } else if (targetY > head.y) {
        direction = { x: 0, y: 1 };
    } else if (targetY < head.y) {
        direction = { x: 0, y: -1 };
    }

    if (!moveInterval) {
        moveInterval = setInterval(update, 100);
    }
});

function update() {
    if (gameOver || !gameStarted) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        alert('Game Over');
        showTryAgainButton();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } else {
        snake.pop();
    }

    draw();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * tileSize, food.y * tileSize, tileSize, tileSize);

    ctx.fillStyle = 'green';
    for (let segment of snake) {
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    }
}

function startCountdown() {
    const countdownInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '48px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);

        countdown--;

        if (countdown < 0) {
            clearInterval(countdownInterval);
            gameStarted = true;
            draw(); // Draw the initial state of the game
        }
    }, 1000);
}

function showTryAgainButton() {
    const button = document.createElement('button');
    button.innerText = 'Try Again';
    button.style.position = 'absolute';
    button.style.left = `${canvas.offsetLeft + canvas.width / 2 - 50}px`;
    button.style.top = `${canvas.offsetTop + canvas.height / 2 - 25}px`;
    button.style.width = '100px';
    button.style.height = '50px';
    button.style.fontSize = '20px';
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        document.body.removeChild(button);
        resetGame();
    });
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    gameOver = false;
    countdown = 3;
    gameStarted = false;
    clearInterval(moveInterval);
    moveInterval = null;
    startCountdown();
}

startCountdown();