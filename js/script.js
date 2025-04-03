document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("board");
    let playerSymbol = "X";
    let aiSymbol = "O";
    let cells = document.querySelectorAll(".cell");
    
    function showSelectionScreen() {
        const selectionScreen = document.createElement("div");
        selectionScreen.className = "screen screen-start";
        selectionScreen.id = "start";
        selectionScreen.innerHTML = `
            <header>
                <h1>Tic Tac Toe</h1>
                <p>Choose Your Symbol</p>
                <button id="chooseX">X</button>
                <button id="chooseO">O</button>
            </header>
        `;
        document.body.appendChild(selectionScreen);

        document.getElementById("chooseX").addEventListener("click", function() {
            playerSymbol = "X";
            aiSymbol = "O";
            startGame(selectionScreen);
        });
        
        document.getElementById("chooseO").addEventListener("click", function() {
            playerSymbol = "O";
            aiSymbol = "X";
            startGame(selectionScreen);
        });
    }

    function startGame(selectionScreen) {
        document.body.removeChild(selectionScreen);
        board.style.display = "block";
        addCellListeners();
    }

    function addCellListeners() {
        cells.forEach(cell => {
            cell.addEventListener("click", function() {
                if (!cell.textContent) {
                    cell.textContent = playerSymbol;
                    if (!checkWinner()) {
                        aiMove();
                        checkWinner();
                    }
                }
            });
        });
    }

    function aiMove() {
        let emptyCells = [...cells].filter(cell => !cell.textContent);
        if (emptyCells.length > 0) {
            let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.textContent = aiSymbol;
        }
    }

    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        
        for (let combo of winningCombinations) {
            let [a, b, c] = combo;
            if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
                alert(`${cells[a].textContent} wins!`);
                resetGame();
                return true;
            }
        }
        
        if ([...cells].every(cell => cell.textContent)) {
            alert("It's a tie!");
            resetGame();
            return true;
        }
        return false;
    }

    function resetGame() {
        cells.forEach(cell => cell.textContent = "");
        showSelectionScreen();
    }
    
    showSelectionScreen();
});

