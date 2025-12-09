// Получаем элементы DOM
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverDiv = document.getElementById('game-over');

// Настройки игры
const gridSize = 20;
const tileCount = canvas.width / gridSize;

// Игровые переменные
let snake = [
    {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop;

// Инициализация игры
function initGame() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;
    generateFood();
    drawGame();
}

// Генерация еды
function generateFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    // Проверяем, что еда не появилась на змейке
    for (let segment of snake) {
        if (segment.x === food.x && segment.y === food.y) {
            generateFood();
            return;
        }
    }
}

// Отрисовка игры
function drawGame() {
    // Очищаем canvas
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Отрисовка змейки
    ctx.fillStyle = '#4ECDC4';
    for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Голова змейки
    ctx.fillStyle = '#45B7D1';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);

    // Отрисовка еды
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

    // Добавляем тень к еде
    ctx.fillStyle = '#FF5252';
    ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 6, gridSize - 6);
}

// Движение змейки
function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    // Проверка столкновения со стенами
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // Проверка столкновения с собой (игнорируем текущую голову)
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        if (head.x === segment.x && head.y === segment.y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // Проверка поедания еды
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();

        // Обновляем рекорд
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
            localStorage.setItem('snakeHighScore', highScore);
        }
    } else {
        snake.pop();
    }
}

// Обработка клавиш
function changeDirection(event) {
    if (!gameRunning) return;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -1;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -1;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 1;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 1;
    }
}

// Основной игровой цикл
function gameStep() {
    moveSnake();
    drawGame();
}

// Старт игры
function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    gameOverDiv.style.display = 'none';

    initGame();
    gameLoop = setInterval(gameStep, 150);
}

// Окончание игры
function gameOver() {
    gameRunning = false;
    clearInterval(gameLoop);
    finalScoreElement.textContent = score;
    gameOverDiv.style.display = 'block';
    restartBtn.style.display = 'inline-block';
}

// Перезапуск игры
function restartGame() {
    gameOverDiv.style.display = 'none';
    restartBtn.style.display = 'none';
    startGame();
}

// Обработчики событий
document.addEventListener('keydown', changeDirection);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

// Инициализация при загрузке страницы
initGame();
