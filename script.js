const gameManager = (function () {
  const menuDisplay = (function () {
    const menu = document.getElementById("menu");
    const playerCards = Array.from(document.querySelectorAll(".player-card"));
    const addTransitionHandler = function (func) {
      playerCards.forEach((card) => card.addEventListener("click", func));
    };
    const hideMenuDisplay = () => (menu.style.display = "none");
    const showMenuDisplay = () => (menu.style.display = "flex");
    return {
      hideMenuDisplay,
      showMenuDisplay,
      addTransitionHandler,
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
      for (let i = 0; i < 9; i++) {
        tiles[i].textContent = "";
      }
      resultElement.textContent = "";
      restartButton.style.visibility = "hidden";
    };
    const showRestartButton = function () {
      restartButton.style.visibility = "visible";
    };
    const addResetHandler = function (func) {
      restartButton.addEventListener("click", func);
    };
    const addTransitionHandler = function (func) {
      returnButton.addEventListener("click", func);
    };
    const addOnClickHandler = function (func) {
      tiles.forEach(tile => tile.addEventListener("click", func));
    };
    const removeOnClickHandler = function (func) {
      tiles.forEach(tile => tile.removeEventListener("click", func));
    };
    const hideInGameDisplay = () => (inGame.style.display = "none");
    const showInGameDisplay = () => (inGame.style.display = "flex");
    return {
      init,
      markTile,
      announceResult,
      reset,
      showRestartButton,
      addResetHandler,
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
        if (
          tiles[line[0]] !== "" &&
          tiles[line[0]] === tiles[line[1]] &&
          tiles[line[1]] === tiles[line[2]]
        )
          return true;
      }
      return false;
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
    return { init, markTile, getTile, getTiles, check, reset, draw };
  })();

  const NormalPlayer = function (name, marker, AI) {
    const getMarker = () => marker;
    const getName = () => name;
    const isAI = () => AI;
    return { getMarker, getName, isAI };
  };

  const AIPlayer = function (name, marker, AI) {
    const { getMarker, getName, isAI } = NormalPlayer(name, marker, AI);
    const markTile = (tiles) => {
      let index = 0;
      while (tiles[index] !== "") {
        index = Math.floor(Math.random() * 9);
      }
      return index;
    };
    return { getMarker, getName, isAI, markTile };
  };

  const PlayerFactory = function (name, marker, isAI) {
    return isAI
      ? AIPlayer(name, marker, isAI)
      : NormalPlayer(name, marker, isAI);
  };

  const DEFAULT_PLAYER = PlayerFactory("X", "X", false);
  let OPTIONAL_PLAYER = null;
  let currentPlayer = DEFAULT_PLAYER;

  const createOptionalPlayer = function (option) {
    OPTIONAL_PLAYER = PlayerFactory("O", "O", option === "AI");
    currentPlayer = DEFAULT_PLAYER;
  };

  const changeCurrentPlayer = function () {
    currentPlayer =
      currentPlayer === DEFAULT_PLAYER ? OPTIONAL_PLAYER : DEFAULT_PLAYER;
  };

  const markTile = function (index) {
    gameBoard.markTile(currentPlayer.getMarker(), index);
    inGameDisplay.markTile(currentPlayer.getMarker(), index);
    if (gameBoard.check() || gameBoard.draw()) {
      inGameDisplay.announceResult(
        gameBoard.draw() ? null : currentPlayer.getName()
      );
      inGameDisplay.showRestartButton();
      inGameDisplay.removeOnClickHandler(tileOnClick);
      return;
    }
    changeCurrentPlayer();
    if (currentPlayer.isAI()) {
      const index = currentPlayer.markTile(gameBoard.getTiles());
      markTile(index);
    }
  };

  const reset = function () {
    inGameDisplay.reset();
    gameBoard.reset();
    inGameDisplay.addOnClickHandler(tileOnClick);
    currentPlayer = DEFAULT_PLAYER;
  };

  const tileOnClick = function (e) {
    const index = this.getAttribute("data-index");
    if (gameBoard.getTile(index) !== "") {
      return;
    }
    e.stopPropagation();
    markTile(index);
  };

  const playerCardOnClick = function () {
    menuDisplay.hideMenuDisplay();
    inGameDisplay.showInGameDisplay();
    createOptionalPlayer(this.getAttribute("data-type"));
  };

  const returnBtnOnClick = function () {
    reset();
    menuDisplay.showMenuDisplay();
    inGameDisplay.hideInGameDisplay();
  };

  const init = function () {
    gameBoard.init();
    inGameDisplay.init();
    menuDisplay.addTransitionHandler(playerCardOnClick);
    inGameDisplay.addResetHandler(reset);
    inGameDisplay.addTransitionHandler(returnBtnOnClick);
    inGameDisplay.addOnClickHandler(tileOnClick);
  };
  init();
})();
