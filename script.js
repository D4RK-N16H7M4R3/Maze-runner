const mazeElement = document.getElementById('maze');
const timerElement = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');
const gridSize = 21; // Must be an odd number
let playerPosition = { x: 1, y: 1 };
let goalPosition = { x: gridSize - 2, y: gridSize - 2 };
let timer = 0;
let timerInterval;

const directions = [
    { dx: 0, dy: -2 }, // up
    { dx: 0, dy: 2 },  // down
    { dx: -2, dy: 0 }, // left
    { dx: 2, dy: 0 }   // right
];

function createMaze() {
    mazeElement.innerHTML = '';
    const cells = [];

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (x % 2 === 0 || y % 2 === 0) {
                cell.classList.add('wall');
            }
            cell.dataset.x = x;
            cell.dataset.y = y;
            cells.push(cell);
            mazeElement.appendChild(cell);
        }
    }

    generateMaze(cells);
    placePlayer();
    placeGoal();
    startTimer();
}

function generateMaze(cells) {
    const stack = [];
    const startCell = cells.find(cell => cell.dataset.x == 1 && cell.dataset.y == 1);
    startCell.visited = true;
    stack.push(startCell);

    while (stack.length > 0) {
        const currentCell = stack.pop();
        const x = parseInt(currentCell.dataset.x);
        const y = parseInt(currentCell.dataset.y);
        const neighbors = getUnvisitedNeighbors(x, y, cells);

        if (neighbors.length > 0) {
            stack.push(currentCell);

            const { nx, ny } = neighbors[Math.floor(Math.random() * neighbors.length)];
            const nextCell = cells.find(cell => cell.dataset.x == nx && cell.dataset.y == ny);

            removeWallBetween(currentCell, nextCell);

            nextCell.visited = true;
            stack.push(nextCell);
        }
    }
}

function getUnvisitedNeighbors(x, y, cells) {
    return directions
        .map(({ dx, dy }) => ({ nx: x + dx, ny: y + dy }))
        .filter(({ nx, ny }) => nx > 0 && nx < gridSize && ny > 0 && ny < gridSize)
        .filter(({ nx, ny }) => !cells.find(cell => cell.dataset.x == nx && cell.dataset.y == ny).visited);
}

function removeWallBetween(cell1, cell2) {
    const x1 = parseInt(cell1.dataset.x);
    const y1 = parseInt(cell1.dataset.y);
    const x2 = parseInt(cell2.dataset.x);
    const y2 = parseInt(cell2.dataset.y);

    const betweenX = (x1 + x2) / 2;
    const betweenY = (y1 + y2) / 2;

    const betweenCell = document.querySelector(`[data-x='${betweenX}'][data-y='${betweenY}']`);
    betweenCell.visited = true;
    betweenCell.classList.remove('wall');
}

function placePlayer() {
    const playerCell = document.querySelector(`[data-x='${playerPosition.x}'][data-y='${playerPosition.y}']`);
    playerCell.classList.add('player');
}

function placeGoal() {
    const goalCell = document.querySelector(`[data-x='${goalPosition.x}'][data-y='${goalPosition.y}']`);
    goalCell.classList.add('goal');
}

function movePlayer(newX, newY) {
    if (newX < 0 || newX >= gridSize || newY < 0 || newY >= gridSize) return;

    const newCell = document.querySelector(`[data-x='${newX}'][data-y='${newY}']`);
    if (newCell.classList.contains('wall')) return;

    const currentCell = document.querySelector(`[data-x='${playerPosition.x}'][data-y='${playerPosition.y}']`);
    currentCell.classList.remove('player');

    playerPosition = { x: newX, y: newY };
    newCell.classList.add('player');

    if (newX === goalPosition.x && newY === goalPosition.y) {
        clearInterval(timerInterval);
        alert(`You reached the goal in ${timer} seconds!`);
    }
}

function handleKeydown(event) {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(playerPosition.x, playerPosition.y - 1);
            break;
        case 'ArrowDown':
            movePlayer(playerPosition.x, playerPosition.y + 1);
            break;
        case 'ArrowLeft':
            movePlayer(playerPosition.x - 1, playerPosition.y);
            break;
        case 'ArrowRight':
            movePlayer(playerPosition.x + 1, playerPosition.y);
            break;
    }
}

function startTimer() {
    timer = 0;
    timerElement.textContent = timer;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

function resetGame() {
    playerPosition = { x: 1, y: 1 };
    goalPosition = { x: gridSize - 2, y: gridSize - 2 };
    createMaze();
}

restartButton.addEventListener('click', resetGame);
document.addEventListener('keydown', handleKeydown);

createMaze();
