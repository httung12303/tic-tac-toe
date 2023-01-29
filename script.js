const gameManager = (function () {
  const menuDisplay = (function () {
    const menu = document.getElementById("menu");
    const playerCards = Array.from(document.querySelectorAll(".player-card"));
    const addTransitionHandler = function (func) {
      playerCards.forEach((card) => card.addEventListener("click", func));
    };
    const hideMenuDisplay = () => (menu.style.display = "none");
    const showMenuDisplay = () => (menu.style.display = "flex");
    const getDifficulty = function () {
      return document.querySelector(
        "input[type='radio'][name='difficulty']:checked"
      ).value;
    };
    const getMarker = function () {
      return document.querySelector(
        "input[type='radio'][name='marker']:checked"
      ).value;
    };
    return {
      hideMenuDisplay,
      showMenuDisplay,
      addTransitionHandler,
      getDifficulty,
      getMarker,
    };
  })();

  const inGameDisplay = (function () {
    const inGame = document.getElementById("in-game");
    const resultElement = document.getElementById("result");
    const restartButton = document.getElementById("restart-button");
    const returnButton = document.getElementById("return-button");
    let onClick = null;
    const tiles = [];
    const init = function () {
      const boardElement = document.querySelector("#game-board");
      for (let i = 0; i < 9; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.setAttribute("data-index", i);
        boardElement.appendChild(tile);
        tiles.push(tile);
      }
    };
    const markTile = function (marker, index) {
      tiles[index].textContent = marker;
    };
    const announceResult = function (player) {
      resultElement.textContent =
        player === null ? "It's a draw!" : `${player} won!`;
    };
    const reset = function () {
      restartButton.style.visibility = "hidden";
      resultElement.textContent = "";
      for (let i = 0; i < 9; i++) {
        tiles[i].textContent = "";
      }
    };
    const showRestartButton = function () {
      restartButton.style.visibility = "visible";
    };
    const addRestartHandler = function (func) {
      restartButton.addEventListener("click", func);
    };
    const addTransitionHandler = function (func) {
      returnButton.addEventListener("click", func);
    };
    const addOnClickHandler = function (func) {
      tiles.forEach((tile) => tile.addEventListener("click", func));
    };
    const removeOnClickHandler = function (func) {
      tiles.forEach((tile) => tile.removeEventListener("click", func));
    };
    const hideInGameDisplay = () => (inGame.style.display = "none");
    const showInGameDisplay = () => (inGame.style.display = "flex");
    return {
      init,
      markTile,
      announceResult,
      reset,
      showRestartButton,
      addRestartHandler,
      hideInGameDisplay,
      showInGameDisplay,
      addTransitionHandler,
      addOnClickHandler,
      removeOnClickHandler,
    };
  })();

  const gameBoard = (function () {
    const tiles = [];
    const init = function () {
      for (let i = 0; i < 9; i++) {
        tiles.push("");
      }
    };
    const markTile = function (marker, index) {
      tiles[index] = marker;
    };
    const unMark = function (index) {
      tiles[index] = "";
    };
    const getTile = function (index) {
      return tiles[index];
    };
    const getTiles = () => tiles;
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const check = function () {
      for (let line of lines) {
        const marker = tiles[line[0]];
        if (
          tiles[line[0]] !== "" &&
          tiles[line[0]] === tiles[line[1]] &&
          tiles[line[1]] === tiles[line[2]]
        )
          return marker;
      }
      return null;
    };
    const draw = function () {
      for (let tile of tiles) {
        if (tile === "") {
          return false;
        }
      }
      return true;
    };
    const reset = function () {
      for (let i = 0; i < 9; i++) {
        tiles[i] = "";
      }
    };
    const isFull = function () {
      for (let i = 0; i < 9; i++) {
        if (tiles[i] === "") {
          return false;
        }
      }
      return true;
    };
    return {
      init,
      markTile,
      unMark,
      getTile,
      getTiles,
      check,
      reset,
      draw,
      isFull,
    };
  })();

  const NormalPlayer = function (name, marker, AI) {
    const getMarker = () => marker;
    const getName = () => name;
    const isAI = () => AI;
    return { getMarker, getName, isAI };
  };

  const AIPlayer = function (name, marker, AI, difficulty) {
    const EASY_MODE = "easy";
    const HARD_MODE = "hard";
    const { getMarker, getName, isAI } = NormalPlayer(name, marker, AI);
    const getOtherMarker = () => {
      return getMarker() === "X" ? "O" : "X";
    };
    const markTile = (function () {
      switch (difficulty) {
        case EASY_MODE:
          return function (gameBoard) {
            const tiles = gameBoard.getTiles();
            let index = 0;
            while (tiles[index] !== "") {
              index = Math.floor(Math.random() * 9);
            }
            return index;
          };
        case HARD_MODE:
          return function (gameBoard) {
            const tiles = gameBoard.getTiles();
            let index = -1;
            let bestVal = -1000;
            for (let i = 0; i < 9; i++) {
              if (tiles[i] !== "") {
                continue;
              }
              gameBoard.markTile(getMarker(), i);
              const val = minimax(0, gameBoard, false);
              gameBoard.unMark(i);
              if (val > bestVal) {
                bestVal = val;
                index = i;
              }
            }
            return index;
          };
      }
    })();
    const evaluate = function (gameBoard) {
      const value = gameBoard.check();
      if (!value) {
        return 0;
      }
      return value === getMarker() ? 10 : -10;
    };
    const minimax = function (depth, gameBoard, isMax) {
      const value = evaluate(gameBoard);
      if (value != 0) {
        return value + (isMax ? -1 : 1) * depth;
      }
      if (gameBoard.isFull()) {
        return 0;
      }
      const tiles = gameBoard.getTiles();
      const marker = isMax ? getMarker() : getOtherMarker();
      if (isMax) {
        let best = -1000;
        for (let i = 0; i < 9; i++) {
          if (tiles[i] !== "") continue;
          gameBoard.markTile(marker, i);
          best = Math.max(best, minimax(depth + 1, gameBoard, !isMax));
          gameBoard.unMark(i);
        }
        return best;
      } else {
        let worst = 1000;
        for (let i = 0; i < 9; i++) {
          if (tiles[i] !== "") continue;
          gameBoard.markTile(marker, i);
          worst = Math.min(worst, minimax(depth + 1, gameBoard, !isMax));
          gameBoard.unMark(i);
        }
        return worst;
      }
    };
    return { getMarker, getName, isAI, markTile };
  };

  const PlayerFactory = function (name, marker, isAI, difficulty) {
    return isAI
      ? AIPlayer(name, marker, isAI, difficulty)
      : NormalPlayer(name, marker, isAI);
  };

  let DEFAULT_PLAYER = null;
  let OPTIONAL_PLAYER = null;
  let currentPlayer = DEFAULT_PLAYER;

  const firstPlayer = function () {
    return DEFAULT_PLAYER.getMarker() === "X"
      ? DEFAULT_PLAYER
      : OPTIONAL_PLAYER;
  };

  const createPlayers = function (option, playerMarker, difficulty) {
    const otherMarker = playerMarker === "O" ? "X" : "O";
    DEFAULT_PLAYER = PlayerFactory(playerMarker, playerMarker, false);
    OPTIONAL_PLAYER = PlayerFactory(
      otherMarker,
      otherMarker,
      option === "AI",
      difficulty
    );
    currentPlayer = firstPlayer();
  };

  const changeCurrentPlayer = function () {
    currentPlayer =
      currentPlayer === DEFAULT_PLAYER ? OPTIONAL_PLAYER : DEFAULT_PLAYER;
  };

  const markTile = function (index) {
    gameBoard.markTile(currentPlayer.getMarker(), index);
    inGameDisplay.markTile(currentPlayer.getMarker(), index);
    if (!!gameBoard.check() || gameBoard.draw()) {
      inGameDisplay.announceResult(
        gameBoard.draw() ? null : currentPlayer.getName()
      );
      inGameDisplay.showRestartButton();
      inGameDisplay.removeOnClickHandler(tileOnClick);
      return;
    }
    changeCurrentPlayer();
    if (currentPlayer.isAI()) {
      const index = currentPlayer.markTile(gameBoard);
      markTile(index);
    }
  };

  const reset = function () {
    inGameDisplay.reset();
    gameBoard.reset();
    inGameDisplay.addOnClickHandler(tileOnClick);
    currentPlayer = firstPlayer();
  };

  const tileOnClick = function (e) {
    const index = this.getAttribute("data-index");
    if (gameBoard.getTile(index) !== "") {
      return;
    }
    e.stopPropagation();
    markTile(index);
  };

  const playerCardOnClick = function (e) {
    if (e.target.classList.contains("stop-onclick")) {
      return;
    }
    menuDisplay.hideMenuDisplay();
    inGameDisplay.showInGameDisplay();
    createPlayers(
      this.getAttribute("data-type"),
      menuDisplay.getMarker(),
      menuDisplay.getDifficulty()
    );
    if (currentPlayer.isAI()) {
      const index = currentPlayer.markTile(gameBoard);
      markTile(index);
    }
    e.stopPropagation();
  };

  const returnBtnOnClick = function (e) {
    reset();
    menuDisplay.showMenuDisplay();
    inGameDisplay.hideInGameDisplay();
    e.stopPropagation();
  };

  const restartBtnOnClick = function (e) {
    reset();
    if (currentPlayer.isAI()) {
      const index = currentPlayer.markTile(gameBoard);
      markTile(index);
    }
  };

  const init = function () {
    gameBoard.init();
    inGameDisplay.init();
    menuDisplay.addTransitionHandler(playerCardOnClick);
    inGameDisplay.addRestartHandler(restartBtnOnClick);
    inGameDisplay.addTransitionHandler(returnBtnOnClick);
    inGameDisplay.addOnClickHandler(tileOnClick);
  };
  init();
})();
