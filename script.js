const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let startTime;
let endTime;
let circle;
let totalReactionTime = 0;
let roundsPlayed = 0;
let gameRunning = true; // flag to control game

const result = document.getElementById("result");
const overlay = document.getElementById("overlay");
const resetButton = document.getElementById("resetButton"); 

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateCircle() {
    const radius = randomInt(10, 50);
    const x = randomInt(radius, canvas.width - radius);
    const y = randomInt(radius, canvas.height - radius - 50); // - 50 account for heading
    const color = `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
    
    circle = { x, y, radius, color };
}

function drawCircle() {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
}

function gameLoop() {
    if (!gameRunning) {
        return; // stop
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    setTimeout(gameLoop, 1000);
}

function startGame() {
    startTime = new Date();
    generateCircle();
    gameLoop();
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function resizeCanvas() {
    const headingHeight = document.querySelector("h1").offsetHeight;
    canvas.width = window.innerWidth - 5; // subtract a few pixels to avoid out of bounds
    canvas.height = window.innerHeight - 5;
}


canvas.addEventListener("click", (event) => {
    const { offsetX, offsetY } = event;
    if (distance(offsetX, offsetY, circle.x, circle.y) <= circle.radius) {
        endTime = new Date();
        const reactionTime = endTime - startTime;
        console.log(`Reaction time: ${reactionTime} ms`);
        totalReactionTime += reactionTime;
        roundsPlayed++;
        
        if (roundsPlayed < 10) { // Play 10 rounds
            startGame();
        } else {
            gameRunning = false;
            const averageReactionTime = totalReactionTime / roundsPlayed;
            result.textContent = `Game over! Average reaction time: ${averageReactionTime.toFixed(2)} ms`;
            overlay.classList.remove("hidden");
            resetButton.style.display = 'block';
        }
    }
});

resetButton.addEventListener("click", () => {
    location.reload();
});

resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    if (roundsPlayed < 10) { // if games isnt over
        startGame();
    }
});

startGame();
