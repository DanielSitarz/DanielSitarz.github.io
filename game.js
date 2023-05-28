let s = 100;
let l = 50;

// Define the static colors and the number of random colors to generate
let staticColors = [
    0,
    100
];
let numRandomColors = 12;

// Generate a random hue shift value between 0 and 360 degrees
function getRandomHueShift() {
    return Math.floor(Math.random() * 361);
}

// Generate random colors by shifting the hue of the static colors
function generateRandomColors() {
    const randomColors = [];

    const start = parseInt(staticColors[0]);
    const end = parseInt(staticColors[1]);

    const hueRange = end - start;
    const hueStep = hueRange / (numRandomColors + 1);

    for (let i = 0; i < numRandomColors; i++) {
        const hueShift = parseFloat(start + hueStep * (i + 1));
        const shiftedColor = {
            value: `hsl(${hueShift}, ${s}%, ${l}%)`,
            hue: hueShift
        };
        randomColors.push(shiftedColor);
    }

    return randomColors;
}

// Initialize the game
function startGame() {
    staticColors = document.getElementById('static-colors').value.split(',');
    numRandomColors = parseInt(document.getElementById('num-random-colors').value);
    s = parseInt(document.getElementById('static-saturation').value);
    l = parseInt(document.getElementById('static-lightness').value);

    colors = generateRandomColors();
    shuffleColors();
    renderColors();

    showScore("");
}

// Shuffle the colors array using the Fisher-Yates algorithm
function shuffleColors(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let shuffledColors = [];

// Render the colors to the screen
function renderColors() {
    const colorContainer = document.getElementById('color-container');
    colorContainer.innerHTML = '';

    shuffledColors.forEach((color) => {
        const colorBox = document.createElement('div');
        colorBox.style.backgroundColor = color.value;
        colorBox.classList.add("color-box");
        colorBox.draggable = true;
        colorContainer.appendChild(colorBox);

        // Add event listeners for drag and drop
        colorBox.addEventListener('dragstart', dragStart);
        colorBox.addEventListener('dragover', dragOver);
        colorBox.addEventListener('dragenter', dragEnter);
        colorBox.addEventListener('dragleave', dragLeave);
        colorBox.addEventListener('drop', dragDrop);

    });
}

function shuffleColors() {
    // Shuffling the middle portion of the colors array
    const middleColors = colors.slice(1, -1); // Exclude first and last color
    const shuffledMiddleColors = shuffleArray(middleColors);

    // Create an array with first, shuffled middle, and last colors
    shuffledColors = [colors[0], ...shuffledMiddleColors, colors[colors.length - 1]];
}

// Drag and drop event handlers
let draggedColor = null;

function dragStart(event) {
    draggedColor = event.target;
    event.dataTransfer.setData('text/plain', draggedColor.textContent);
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function dragEnter(event) {
    event.target.classList.add('over');
}

function dragLeave(event) {
    event.target.classList.remove('over');
}

function dragDrop(event) {
    event.preventDefault();
    const droppedColor = event.target;
    swapColors(draggedColor, droppedColor);
    event.target.classList.remove('over');
}

// Swap colors when dragged color is dropped
function swapColors(source, target) {
    const sourceIndex = Array.from(source.parentNode.children).indexOf(source);
    const targetIndex = Array.from(target.parentNode.children).indexOf(target);

    if (sourceIndex !== -1 && targetIndex !== -1) {
        const temp = shuffledColors[sourceIndex];
        shuffledColors[sourceIndex] = shuffledColors[targetIndex];
        shuffledColors[targetIndex] = temp;

        // Set initial transform positions
        source.style.transform = `translateX(${target.offsetLeft - source.offsetLeft}px)`;
        target.style.transform = `translateX(${source.offsetLeft - target.offsetLeft}px)`;

        // Apply transition class
        source.classList.add('swap-transition');
        target.classList.add('swap-transition');

        // Wait for transition to finish before re-rendering
        setTimeout(() => {
            source.classList.remove('swap-transition');
            target.classList.remove('swap-transition');
            // Apply final transform positions
            source.style.transform = '';
            target.style.transform = '';
            renderColors();
        }, 200);
    }
}

// Calculate the score based on the order of colors chosen by the user
function calculateScore() {
    // Calculate the score based on the user's order
    const score = calculateColorScore() / (numRandomColors - 1) * 100;

    // Display the score to the user
    showScore(score);
}

function showScore(score) {
    const scoreContainer = document.getElementById('score-container');

    if (score == "") {
        scoreContainer.textContent = ``;
    } else {
        scoreContainer.textContent = `Your score: ${score}%`;
    }
}

// Calculate the score based on color order
function calculateColorScore() {
    let score = 0;

    for (let i = 0; i < shuffledColors.length - 1; i++) {
        const currentColor = shuffledColors[i].hue;
        const nextColor = shuffledColors[i + 1].hue;
        console.log(currentColor);
        console.log(nextColor);
        if (currentColor <= nextColor) {
            score++;
        }
    }

    return score;
}

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Start the game when the page loads
window.addEventListener('load', startGame);
