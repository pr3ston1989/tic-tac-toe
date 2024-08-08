const Gameboard = (function() {
    let board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    //let board = [['✕', '✕', '◯'], ['◯', '✕', '✕'], ['◯', '◯', '✕']];
    const checkField = (indexX, indexY, player) => {
        if (board[indexX][indexY] === ' ') {
            board[indexX][indexY] = player.symbol;
        }        
    };

    const resetBoard = () => board = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];
    const showBoard = () => board;
    return {checkField, showBoard, resetBoard}; 
})();


function game() {
    const checkWin = function(player) {
        let sym = player.symbol;
        let board = Gameboard.showBoard();
        let diagonalOne = 0;
        let diagonalTwo = 0;
        for (let x = 0; x < 3; x++) {
            if (board[x][x] === sym) {
                diagonalOne++;
                if (diagonalOne === 3) {
                    return true;
                }
            }
            if (board[x][2 - x] === sym) {
                diagonalTwo++;
                if (diagonalTwo === 3) {
                    return true;
                }
            }
            if (board[x][0] === sym &&
                board[x][1] === sym &&
                board[x][2] === sym) {
                    return true;
                }
            if (board[0][x] === sym &&
                board[1][x] === sym &&
                board[2][x] === sym) {
                    return true;
                }
        }
        let checkForEmpty = false;
        board.forEach((arr) => {
            if (arr.includes(' ')) {
                checkForEmpty = true;
            }
        })
        if (!checkForEmpty) {
            return false;
        }
    };

    const clickField = (game, player1, player2) => {
        const fields = document.getElementsByClassName("game-field");
        let activePlayer;
        for (const field of fields) {
            field.addEventListener('click', () => {
                if (game.checkWin(player1) === undefined &&
                    game.checkWin(player2) === undefined) {
                    let xy = field.id.split('x');
                    if (player1.showStatus() === true) {
                        activePlayer = player1;
                        player1.changeStatus();
                        player2.changeStatus();
                    } else {
                        activePlayer = player2;
                        player1.changeStatus();
                        player2.changeStatus();
                    }
                    Gameboard.checkField(Number(xy[0]), Number(xy[1]), activePlayer);
                    field.innerHTML = `<p>${Gameboard.showBoard()[Number(xy[0])][Number(xy[1])]}</p>`;
                    } else if (game.checkWin(player1) === true ||
                               game.checkWin(player2) === true ||
                               game.checkWin(player2) === false ||
                               game.checkWin(player1) === false) {
                        player1.resetStatus();
                        player2.resetStatus();
                        const result = document.getElementById("result");
                        if (game.checkWin(player1) === true) {
                            result.textContent = `${player1.name} IS THE WINNER!`
                        } else if (game.checkWin(player2) === true) {
                            result.textContent = `${player2.name} IS THE WINNER!`
                        } else if (game.checkWin(player2) === false) {
                            result.textContent = "IT'S A TIE!"
                        }
                        const restart = document.getElementById("restart");
                        restart.disabled = false;

         }
                })
        }
    }
    return {checkWin, clickField}
}


function createPlayer (name, symbol, defaultStatus) {
    let score = 0;
    let activeFlag = defaultStatus;
    const changeStatus = () => activeFlag = (activeFlag) ? false : true; 
    const showStatus = () => activeFlag;
    const resetStatus = () => activeFlag = defaultStatus;
    const showScore = () => score;
    const giveScore = () => score++;
    const pickField = (field) => field;
    return {name, symbol, giveScore, showScore, pickField, changeStatus, showStatus, resetStatus};
}

function sendToDOM () {
    const fillBoard = (gameboard) => {
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const field = document.getElementById(`${x}x${y}`);
                field.textContent = gameboard.showBoard()[x][y];
            }
        }
    };

    const displayScore = (player1, player2) => {
        const playerOneScore = document.getElementById("player-one-score")
        playerOneScore.textContent = `${player1.name}'s score: ${player1.showScore()}`;
        const playerTwoScore = document.getElementById("player-two-score");
        playerTwoScore.textContent = `${player2.name}'s score: ${player2.showScore()}`;
    }
    return {fillBoard, displayScore}
}

function playGame(player1, player2) {
    const mainGame = game();
    const result = document.getElementById("result");
    if (mainGame.checkWin(player1) === undefined &&
        mainGame.checkWin(player2) === undefined) {
            mainGame.clickField(mainGame, player1, player2);
        }
}


let display;

const start = document.getElementById("start");
start.addEventListener("click", function(event) {
    event.preventDefault();
    start.disabled = true;
    const playerOneName = document.getElementById("player-one").value;
    const playerTwoName = document.getElementById("player-two").value;
    const player1 = createPlayer((playerOneName || "Player One"), "✕", true);
    const player2 = createPlayer((playerTwoName || "Player Two"), "◯", false);
    display = sendToDOM();
    display.fillBoard(Gameboard);
    playGame(player1, player2);
})

const restart = document.getElementById("restart");
restart.addEventListener("click", function(event) {
    event.preventDefault();
    restart.disabled = true;
    Gameboard.resetBoard();
    display.fillBoard(Gameboard);
})