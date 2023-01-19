const gameManager = (function () {
  let currentPlayer = null;
  let players = null;

  const displayController = (function () {
    const tiles = [];
    const init = function() {
        const boardElement = document.querySelector("#gameBoard");
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
    return { init, markTile };
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
      console.log(tiles);
    };
    const getTile = function(index) {
        return tiles[index];
    }
    const rowCheck = function (row) {
        console.log(row);
        return tiles[row * 3] === tiles[row * 3 + 1] && tiles[row * 3] === tiles[row * 3 + 2];
    }
    const columnCheck = function (column) {
        return tiles[column * 3] === tiles[column + 3] && tiles[column] === tiles[column + 6];
    }
    const diagonalCheck = function(row, column) {
        let result = false;
        if(row === column) {
            result = (tiles[0] === tiles[4]) && (tiles[0] === tiles[8]);
        }
        if(row + column === 2) {
            result = result || ((tiles[2] === tiles[4]) && (tiles[2] === tiles[6]));
        }
        return result;
    }
    const check = function (index) {
        const row = Math.floor(index / 3);
        const column = index % 3;
        return  rowCheck(row) || columnCheck(column) || diagonalCheck(row, column); 
    };
    return { init, markTile, getTile, check };
  })();

  const Player = function (name, marker) {
    const getMarker = () => marker;
    const getName = () => name;
    return { getMarker, getName };
  };

  const createPlayers = function() {
    players = [];
    players.push(Player('X', 'X'));
    players.push(Player('O', 'O'));
    currentPlayer = players[0];
  }

  const tileOnClick = function(e) {
    const target = e.target;
    const index = target.getAttribute('data-index');
    if(!target.classList.contains('tile') || gameBoard.getTile(index) !== '') {
        return;
    }
    gameBoard.markTile(currentPlayer.getMarker(), index);
    displayController.markTile(currentPlayer.getMarker(), index);
    if(gameBoard.check(index)) {
        document.getElementById('gameResult').textContent = currentPlayer.getName();
    }
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    e.stopPropagation();
  }

  const init = function() {
    gameBoard.init();
    displayController.init();
    createPlayers();
    window.addEventListener('click', tileOnClick);
  }
  init();
})();
