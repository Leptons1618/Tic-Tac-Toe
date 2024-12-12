let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let w; // = width / 3;
let h; // = height / 3;

const ai = 'X';
const human = 'O';
let currentPlayer;
let gameMode;
let winLine = null;

let humanWins = 0;
let aiWins = 0;
let tiesCount = 0;
let player1Label = "You (O)";
let player2Label = "AI (X)";
let resultP = null; // To keep track of result message
let humanLosses = 0;
let aiLosses = 0;
let playAgainButton; // To reference the Play Again button

function setup() {
    createCanvas(600, 600); // Increased canvas size
    w = width / 3;
    h = height / 3;
    noLoop();
    
    // Reference to Play Again button
    playAgainButton = select('#playAgainButton');
    playAgainButton.hide(); // Ensure it's hidden initially
}

function startGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    winLine = null;
    gameMode = document.getElementById('gameMode').value;
    const startingPlayerValue = document.getElementById('startingPlayer').value;

    if (gameMode === 'ai') {
        currentPlayer = startingPlayerValue === 'human' ? human : ai;
        // Update table labels
        document.getElementById('player1Label').innerText = 'You (O)';
        document.getElementById('player2Label').innerText = 'AI (X)';
    } else if (gameMode === '2player') {
        currentPlayer = startingPlayerValue === 'player1' ? human : ai;
        // Update table labels
        document.getElementById('player1Label').innerText = 'Player 1 (O)';
        document.getElementById('player2Label').innerText = 'Player 2 (X)';
    }

    // Show the stats table
    document.getElementById('statsTable').style.display = 'block';

    // Remove existing result message if any
    if (resultP) {
        resultP.remove();
        resultP = null;
    }

    loop();
    document.getElementById('startButton').disabled = true; // Disable button during game
    document.getElementById('startButton').innerText = 'Game in Progress...';
    playAgainButton.hide(); // Hide Play Again button during game

    if (currentPlayer === ai) {
        bestMove();
    }
}

function equals3(a, b, c) {
    return a == b && b == c && a != '';
}

function checkWinner() {
    let winner = null;

    // Horizontal
    for (let j = 0; j < 3; j++) { // Changed to j
        if (equals3(board[j][0], board[j][1], board[j][2])) { // Changed from board[i][x]
            winner = board[j][0];
            winLine = { type: 'horizontal', index: j };
        }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
            winLine = { type: 'vertical', index: i };
        }
    }

    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
        winLine = { type: 'diagonal', index: 0 };
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
        winLine = { type: 'diagonal', index: 1 };
    }

    let openSpots = 0;
    for (let j = 0; j < 3; j++) { // Changed to j
        for (let i = 0; i < 3; i++) { // Changed to i
            if (board[j][i] == '') { // Changed from board[i][j]
                openSpots++;
            }
        }
    }

    if (winner == null && openSpots == 0) {
        tiesCount++;
        updateStats();
        return 'tie';
    } else if (winner != null) {
        if (winner === human) {
            humanWins++; // Increment by 1 instead of adding score
            aiLosses++;
        } else if (winner === ai) {
            aiWins++; // Increment by 1 instead of adding score
            humanLosses++;
        }
        updateStats();
        return winner;
    } else {
        return null;
    }
}

function mousePressed() {
    if (gameMode === '2player' || currentPlayer == human) {
        let i = floor(mouseX / w);
        let j = floor(mouseY / h);
        if (board[j][i] == '') {
            board[j][i] = currentPlayer;
            currentPlayer = currentPlayer === human ? ai : human;
            if (gameMode === 'ai' && currentPlayer === ai) {
                bestMove();
            }
        }
    }
}

function draw() {
    background(255);
    strokeWeight(4);

    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, width, h);
    line(0, h * 2, width, h * 2);

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let spot = board[j][i]; // Fix: Access board[j][i] instead of board[i][j]
            textSize(32);
            let r = w / 4;
            if (spot == human) {
                stroke(0, 0, 255); // Blue color for O
                noFill();
                ellipse(x, y, r * 2);
            } else if (spot == ai) {
                stroke(255, 0, 0); // Red color for X
                line(x - r, y - r, x + r, y + r);
                line(x + r, y - r, x - r, y + r);
            }
        }
    }

    let result = checkWinner();
    if (result != null) {
        noLoop();
        if (result !== 'tie') {
            if (winLine) {
                stroke(0, 255, 0); // Green color for win line
                strokeWeight(8);
                if (winLine.type === 'horizontal') {
                    let y = winLine.index * h + h / 2;
                    line(0, y, width, y);
                } else if (winLine.type === 'vertical') {
                    let x = winLine.index * w + w / 2;
                    line(x, 0, x, height);
                } else if (winLine.type === 'diagonal') {
                    if (winLine.index === 0) {
                        line(0, 0, width, height);
                    } else {
                        line(0, height, width, 0);
                    }
                }
            }
        }

        // Create result message
        if (resultP) {
            resultP.remove();
        }
        resultP = createP('');
        resultP.style('font-size', '32pt');
        if (result == 'tie') {
            resultP.html('Tie!');
        } else {
            resultP.html(`${result} wins!`);
        }

        // Enable Start Game button and show Play Again button
        document.getElementById('startButton').disabled = false; // Enable button after game
        document.getElementById('startButton').innerText = 'New Game';
        playAgainButton.show(); // Show Play Again button
    }
}

function updateStats() {
    document.getElementById('humanWins').innerText = humanWins;
    document.getElementById('humanLosses').innerText = humanLosses;
    document.getElementById('aiWins').innerText = aiWins;
    document.getElementById('aiLosses').innerText = aiLosses;
    document.getElementById('ties').innerText = tiesCount; // Ensure this ID matches the HTML
}