!function(){

  /*
    Screen constructor function
  */
  function Screen(className, id, messageText, buttonText) {
    this.div = document.createElement("div");
    this.div.className = className;
    this.div.id = id;
    this.header = document.createElement("header");
    this.title = document.createElement("h1");
    this.title.textContent = "Tic Tac Toe";
    this.message = document.createElement("p");
    this.button = document.createElement("a");
    this.button.textContent = buttonText;
    this.button.className = "button";
    this.button.setAttribute("href", "#");
    this.message.textContent = messageText;
    this.message.className = "message";
    // Append title, message(if not empty), and button to header
    this.header.appendChild(this.title);
    if(messageText !== "") {
      this.header.appendChild(this.message);
    }
    this.header.appendChild(this.button);
    // Append header to screen div
    this.div.appendChild(this.header);
  }
  /*
    Screen object methods
  */
  Screen.prototype.showScreen = function () {
    this.div.style.display = "";
  };
  Screen.prototype.hideScreen = function() {
    this.div.style.display = "none";
  };

  /*
    Game constructor function
  */
  function Game(board, players, screens) {
    this.title = "Tic Tac Toe";
    this.board = board;
    this.players = players;
    players[0].element.className = "players active";
    this.screens = screens;
    this.currentTurn = 'o';
    this.winner = "none";
  }
  /*
    Game object methods
  */
  Game.prototype.startGame = function () {
    this.showStartScreen();
    // DOM Handlers
    game.screens.startScreen.button.addEventListener("click", () => game.showBoard());
    game.screens.endScreenWin.button.addEventListener("click", () => game.reset());
    game.screens.endScreenDraw.button.addEventListener("click", () => game.reset());
    game.board.boxesUL.addEventListener("mouseleave", () => board.removeBackgroundImage());
    game.board.boxesUL.addEventListener("mouseover",
      event => board.changeBackgroundImage(event.target, game.currentTurn));
    game.board.div.addEventListener("click",
      event => game.executeMove(event.target, board.boxes));
  };
  Game.prototype.showStartScreen = function () {
    // Shows start screen, hides all the other screens
    this.board.div.style.display = "none";
    this.screens.endScreenWin.hideScreen();
    this.screens.endScreenDraw.hideScreen();
    this.screens.startScreen.showScreen();
  };
  Game.prototype.showBoard = function() {
    this.board.div.style.display = "";
    startScreen.hideScreen();
  };
  Game.prototype.executeMove = function(target, boxes) {
    if ( target.tagName === "LI" && !target.className.includes("box-filled") ) {
      /*
        When the player clicks on an empty square, attach
        the class box-filled-1 (for O) or box-filled-2 (for X)
        to the square.
      */
      target.removeAttribute("style");
      target.className = this.currentTurn === 'o' ? "box box-filled-1" : "box box-filled-2";
      /*
        At each move, check if current player made a winning move,
        or if the game is a draw. Show end screen accordingly.
      */
      if (this.result(boxes) === this.currentTurn) {
        this.screens.endScreenWin.div.className = `screen screen-win screen-win-${this.getWinner()}`;
        this.screens.endScreenWin.showScreen();
        this.board.div.style.display = "none";
      } else if (this.result(boxes) === "draw") {
        this.screens.endScreenDraw.showScreen();
        this.board.div.style.display = "none";
      }
      /*
        Once one player has made their move,
        switch turns and make other player active.
      */
      this.currentTurn = this.currentTurn === 'o' ? 'x' : 'o';
      if (this.currentTurn === 'x') {
        this.players[0].element.className = "players";
        this.players[1].element.className = "players active";
      } else if (this.currentTurn === 'o') {
        this.players[0].element.className = "players active";
        this.players[1].element.className = "players";
      }
    }
  };
  Game.prototype.result = function(boxes) {
    /*
      If isWin is true, returns currentTurn('x' or 'o'),
      or if isDraw is true, returns "draw",
      else returns "continue".
    */
    return this.isWin() ? this.currentTurn : false || this.isDraw() ? "draw" : false || "continue";
  };
  Game.prototype.isWin = function() {
    /*
      If checkColumns or checkRows or checkDiagonal are true,
      return true
    */
    return this.board.checkColumns() || this.board.checkRows() || this.board.checkDiagonal();
  };
  Game.prototype.isDraw = function() {
    // Returns true if every box is filled.
    return !this.board.boxes.map( box => box.className.includes("box-filled") ).includes(false);
  };
  Game.prototype.getWinner = function() {
    // Returns "one" if player1 is active, "two" otherwise.
    return this.players[0].element.className.includes("active") ? "one" : "two";
  };
  Game.prototype.reset = function() {
    /*
      When a player pushes the "New Game" button,
      the board appears again, empty, and a new game begins.
    */
    this.currentTurn = 'o';
    this.screens.endScreenWin.div.className = "screen screen-win";
    this.screens.endScreenWin.hideScreen();
    this.screens.endScreenDraw.hideScreen();
    this.players[0].element.className = "players active";
    this.players[1].element.className = "players";
    this.board.clear();
    this.board.div.style.display = "";
  };
  /*
    Board constructor function
  */
  function Board() {
    this.div = document.getElementById("board");
    this.boxesUL = document.querySelector(".boxes");
    this.boxes = Array.from(this.boxesUL.children);
    this.prevBox;
  }
  /*
    Board object methods
  */
  Board.prototype.changeBackgroundImage = function(target, currentTurn) {
    /*
      When the current player mouses over an empty square on the board,
      its symbol("X" or "O") should appear on the box.
    */
    if (target.tagName === "LI"
    && !target.className.includes("box-filled")
    && this.prevBox != target) {
        if (this.prevBox !== undefined) {
          this.prevBox.style.backgroundImage="";
        }
        target.style.backgroundImage = currentTurn === 'o' ? "url(img/o.svg)" : "url(img/x.svg)";
        this.prevBox = target;
      }
  }
  Board.prototype.removeBackgroundImage = function() {
    /*
      Clears backgroundImage from box when mouse leaves
      board area.
    */
    this.boxes.forEach(box => {
      if (!box.className.includes("box-filled")) {
        box.style.backgroundImage="";
      }
    });
  };
  Board.prototype.checkColumns = function() {
    /*
      Returns true if any column of the board
      has three symbols('X' or 'O') sequentially.
    */
    for (let i=0; i < 3; i++) {
      if (this.boxes[i].className.includes("box-filled")
      && this.boxes[i].className === this.boxes[i+3].className
      && this.boxes[i].className === this.boxes[i+6].className) {
        return true;
      }
    }
    return false;
  };
  Board.prototype.checkRows = function() {
    /*
      Returns true if any row of the board
      has three symbols('X' or 'O') sequentially.
    */
    for (let i=0; i < 8; i += 3) {
      if (this.boxes[i].className.includes("box-filled")
      && this.boxes[i].className === this.boxes[i+1].className
      && this.boxes[i].className === this.boxes[i+2].className) {
        return true;
      }
    }
    return false;
  };
  Board.prototype.checkDiagonal = function() {
    /*
      Returns true if a player has three symbols('X' or 'O')
      in a row diagonally.
    */
    let result = false;
    if (this.boxes[4].className.includes("box-filled")) {
      result =
        this.boxes[0].className === this.boxes[4].className &&
        this.boxes[0].className === this.boxes[8].className ||
        this.boxes[2].className === this.boxes[4].className &&
        this.boxes[2].className === this.boxes[6].className;
    }
    return result;
  };
  Board.prototype.clear = function() {
    // Removes any images and styles from each box on the board.
    this.boxes.forEach( (box) => {
      box.className = "box";
      box.removeAttribute("style");
    });
  };
  /*
    Player constructor function
  */
  function Player(name) {
    this.name = name;
    this.isWinner = false;
    this.element = document.getElementById(name);
  }
  /* Utility function */
  function appendToBody() {
    // Appends arguments to body of webpage.
    for(let i=0; i<arguments.length; i++) {
      document.querySelector("body").appendChild(arguments[i]);
    }
  };

  /*
    Declare and initialize objects
  */
  const startScreen = new Screen("screen screen-start", "start", "", "Start game");
  const endScreenWin = new Screen("screen screen-win", "finish", "Winner", "New game");
  const endScreenDraw = new Screen("screen screen-win screen-win-tie", "finish", "It's a draw", "New game");
  const screens = {startScreen, endScreenWin, endScreenDraw};
  const players = [new Player("player1"), new Player("player2")];
  const board = new Board();
  const game = new Game(board, players, screens);
  // Append screens to DOM
  appendToBody(startScreen.div, endScreenWin.div, endScreenDraw.div);
  // Start the game!
  game.startGame();

}();
