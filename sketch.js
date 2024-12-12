let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

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

function startGame(resetStats = false) {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''] // Add the third row
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

    // Reset stats table for a new game if resetStats is true
    if (resetStats) {
        document.getElementById('humanWins').innerText = 0;
        document.getElementById('humanLosses').innerText = 0;
        document.getElementById('aiWins').innerText = 0;
        document.getElementById('aiLosses').innerText = 0;
        document.getElementById('ties').innerText = 0;
        humanWins = 0;
        aiWins = 0;
        tiesCount = 0;
        humanLosses = 0;
        aiLosses = 0;
    }

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

function evaluateWinner(board) {
    let winner = null;
    let winInfo = null;

    // Horizontal
    for (let j = 0; j < 3; j++) {
        if (equals3(board[j][0], board[j][1], board[j][2])) {
            winner = board[j][0];
            winInfo = { type: 'horizontal', index: j };
        }
    }

    // Vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
            winInfo = { type: 'vertical', index: i };
        }
    }

    // Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
        winInfo = { type: 'diagonal', index: 0 };
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
        winInfo = { type: 'diagonal', index: 1 };
    }

    let openSpots = 0;
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            if (board[j][i] == '') {
                openSpots++;
            }
        }
    }

    if (winner == null && openSpots == 0) {
        return { winner: 'tie', winInfo: null };
    } else {
        return { winner, winInfo };
    }
}

function checkWinner() {
    let result = evaluateWinner(board);
    if (result.winner != null) {
        if (result.winner == 'tie') {
            tiesCount++;
        } else if (result.winner === human) {
            humanWins++;
            aiLosses++;
        } else if (result.winner === ai) {
            aiWins++;
            humanLosses++;
        }
        winLine = result.winInfo; // Set the winLine variable
        updateStats();
        return result.winner;
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
                stroke(0, 0, 0); // Black color for win line
                strokeWeight(4); // Thinner line
                let offset = w / 6; // Shorten the line
                if (winLine.type === 'horizontal') {
                    let y = winLine.index * h + h / 2;
                    line(offset, y, width - offset, y);
                } else if (winLine.type === 'vertical') {
                    let x = winLine.index * w + w / 2;
                    line(x, offset, x, height - offset);
                } else if (winLine.type === 'diagonal') {
                    if (winLine.index === 0) {
                        line(offset, offset, width - offset, height - offset);
                    } else {
                        line(offset, height - offset, width - offset, offset);
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