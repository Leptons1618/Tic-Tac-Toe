function bestMove() {
    // AI to make its turn
    let bestScore = -Infinity;
    let move;
    for (let j = 0; j < 3; j++) { // Changed outer loop variable to j
        for (let i = 0; i < 3; i++) { // Changed inner loop variable to i
            // Is the spot available?
            if (board[j][i] == '') { // Changed from board[i][j]
                board[j][i] = ai;
                let score = minimax(board, 0, false);
                board[j][i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { j, i }; // Changed to { j, i }
                }
            }
        }
    }
    board[move.j][move.i] = ai; // Changed from board[move.i][move.j]
    currentPlayer = human;
}

const scores = {
    X: 10,
    O: -10,
    tie: 0
};

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return scores[result]; // This return value is used only within minimax
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = ai;
                    let score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // Is the spot available?
                if (board[i][j] == '') {
                    board[i][j] = human;
                    let score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}