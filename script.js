"use strict";

const playerFactory = function (sign) {
  let object = Object.create(playerFactory.proto);
  object.sign = sign;
  object.score = 0;
  return object;
};

playerFactory.proto = {
  getScore: function () {
    return this.score;
  },
  addScore: function () {
    this.score++;
  },
  getSign: function () {
    return this.sign;
  },
};

const userInterface = (() => {
  // UI ELEMENTS
  const settingFormEl = document.getElementById("setting_form");
  const errorMessageLabelEl = document.getElementById("setting-form_error");
  const boardContainerEl = document.getElementById("board_container");
  const playerTurnLabelEl = document.getElementById("current-player");
  const winnerLabelEl = document.getElementById("player-won");
  const victorLabelEl = document.getElementById("victory");
  const newGameBtn = document.getElementById("new_game");
  const playerEl = [
    {
      sign: document.getElementById("player1_symbol"),
      score: document.getElementById("player1_score"),
    },
    {
      sign: document.getElementById("player2_symbol"),
      score: document.getElementById("player2_score"),
    },
  ];

  //
  //FUNCTIONS
  //

  const getNewGameBtn = function () {
    return newGameBtn;
  };

  const displayVictor = function (message) {
    victorLabelEl.textContent = message;
    victorLabelEl.textContent = message;
    victorLabelEl.closest("#victor-card_overlay").classList.remove("hidden");
    setTimeout(() => {
      victorLabelEl.parentElement.classList.add("opacity-100");
    }, 200);
  };

  const hideVictor = function () {
    victorLabelEl.parentElement.classList.remove("opacity-100");
    setTimeout(() => {
      victorLabelEl.closest("#victor-card_overlay").classList.add("hidden");
    }, 200);
  };

  const hideWinner = function () {
    winnerLabelEl.closest("#won-card_overlay").classList.add("hidden");
    winnerLabelEl.parentElement.classList.remove("opacity-100");
  };
  const displayWinner = function (message) {
    winnerLabelEl.textContent = message;
    winnerLabelEl.closest("#won-card_overlay").classList.remove("hidden");
    setTimeout(() => {
      winnerLabelEl.parentElement.classList.add("opacity-100");
    }, 200);
  };

  const updatePlayerTurn = function (id) {
    playerTurnLabelEl.textContent = `Player ${id}`;
  };

  const displaySign = function (id, sign) {
    playerEl[id - 1].sign.textContent = sign;
  };
  const displayScore = function (id, score) {
    playerEl[id - 1].score.textContent = score;
  };

  const openSettingForm = function () {
    settingFormEl.closest("#setting-form_overlay").classList.remove("hidden");
  };

  const closeSettingForm = function () {
    settingFormEl.closest("#setting-form_overlay").classList.add("hidden");
  };

  const getBoardContainer = function () {
    return boardContainerEl;
  };

  const getSettingForm = function () {
    return settingFormEl;
  };

  // Display error message inside form
  const displayErrorMessage = function (message) {
    errorMessageLabelEl.textContent = `🚨${message}`;
    errorMessageLabelEl.parentElement.classList.remove("hidden");
    setTimeout(function (params) {
      errorMessageLabelEl.parentElement.classList.add("opacity-100");
    }, 100);
  };

  //Hide error Message
  const hideErrorMessage = function () {
    errorMessageLabelEl.parentElement.classList.add("hidden");
    errorMessageLabelEl.parentElement.classList.remove("opacity-100");
  };

  const resetSettingForm = function () {
    hideErrorMessage();
    getSettingForm().reset();
  };
  return {
    getSettingForm,
    displayErrorMessage,
    hideErrorMessage,
    resetSettingForm,
    getBoardContainer,
    closeSettingForm,
    openSettingForm,
    displaySign,
    displayScore,
    updatePlayerTurn,
    displayWinner,
    hideWinner,
    displayVictor,
    hideVictor,
    getNewGameBtn,
  };
})();

const gameConfiguration = (() => {
  let maxRound;
  const setMaxRound = function (round) {
    if (round > 0) {
      maxRound = round;
      return true;
    }
    return false;
  };

  const getMaxRound = function () {
    return maxRound;
  };

  return { setMaxRound, getMaxRound };
})();

const gameBoard = (() => {
  let enabled = false;
  const tiles = [];
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const getWinningCombination = function () {
    return winningCombinations;
  };

  const isEnabled = function () {
    return enabled;
  };
  const toggleGameBoard = function () {
    enabled = enabled ? false : true;
  };

  const getTile = function (id) {
    return tiles[id];
  };

  const createTileElement = function (id) {
    let tile = document.createElement("div");
    tile.classList.add("game-tile");
    tile.dataset.id = id;
    return tile;
  };

  const updateTile = function (id, sign) {
    if (!isEnabled) return false;
    if (tiles[id].textContent.length === 1) return false;
    tiles[id].textContent = sign;
    return true;
  };

  const resetTiles = function () {
    // reset tiles array
    tiles.splice(0, tiles.length);
    const tilesContainer = userInterface.getBoardContainer();
    tilesContainer.innerHTML = "";
    for (let index = 0; index < Math.pow(3, 2); index++) {
      tiles.push(createTileElement(index));
      tilesContainer.insertAdjacentElement("beforeend", tiles[index]);
    }
  };
  return {
    resetTiles,
    getTile,
    toggleGameBoard,
    isEnabled,
    updateTile,
    getWinningCombination,
  };
})();

const gameLogic = (() => {
  let currentPlayerTurn = 1;
  const players = [];
  let round = 0;
  let moves = 0;

  const getTotalWinner = function () {
    if (players[0].getScore() === players[1].getScore()) {
      return false;
    }
    return players[0].getScore() > players[1].getScore()
      ? "Player 1"
      : "Player 2";
  };

  const start = function () {
    round++;
    currentPlayerTurn = 1;
    moves = 0;
    gameBoard.resetTiles();
    updateUi();
    gameBoard.toggleGameBoard();
  };

  const reset = function () {
    setTimeout(() => {
      userInterface.hideWinner();
      if (round == gameConfiguration.getMaxRound()) {
        const victor = getTotalWinner();
        if (victor) {
          userInterface.displayVictor(`${victor} Total Victory!`);
        } else {
          userInterface.displayVictor("Game Tied!");
        }
        round = 0;
        return;
      }
      start();
    }, 2000);
  };

  const win = function () {
    gameBoard.toggleGameBoard();
    getPlayer(getCurrentPlayerTurn()).addScore();
    userInterface.displayWinner(`Player ${getCurrentPlayerTurn()} Won!`);
    reset();
  };

  const tie = function () {
    gameBoard.toggleGameBoard();
    userInterface.displayWinner(`Tied`);
    reset();
  };

  const checkWinner = function (sign) {
    for (const combination of gameBoard.getWinningCombination()) {
      const [pos1, pos2, pos3] = combination;
      if (
        gameBoard.getTile(pos1).textContent === sign &&
        gameBoard.getTile(pos2).textContent === sign &&
        gameBoard.getTile(pos3).textContent === sign
      ) {
        return true;
      }
    }
    return false;
  };

  const makeMove = function (id) {
    const sign = getPlayer(getCurrentPlayerTurn()).getSign();
    if (!gameBoard.updateTile(id, sign)) return;
    if (checkWinner(sign)) {
      win();
      return;
    }
    if (moves === Math.pow(3, 2) - 1) {
      tie();
      return;
    }
    toggleCurrentPlayerTurn();
    updateUi();
  };

  const setPlayer = function (id, sign) {
    // id should be only 1 and 2 indicate player1, player2
    if (id < 1 || id > 2) return;
    players.push(playerFactory(sign));
  };

  const getPlayer = function (id) {
    if (id < 1 || id > 2) return;
    return players[id - 1];
  };

  const toggleCurrentPlayerTurn = function () {
    currentPlayerTurn = currentPlayerTurn === 1 ? 2 : 1;
    moves++;
  };
  const getCurrentPlayerTurn = function () {
    return currentPlayerTurn;
  };

  const updateUi = function () {
    for (let index = 1; index <= 2; index++) {
      userInterface.displayScore(index, getPlayer(index).getScore());
      userInterface.displaySign(index, getPlayer(index).getSign());
    }
    userInterface.updatePlayerTurn(getCurrentPlayerTurn());
  };

  userInterface.getSettingForm().addEventListener("submit", function (event) {
    event.preventDefault();
    // Get Form Data
    const settingData = new FormData(event.target);
    const maxRound = settingData.get("max-round");
    const [player1Sign, player2Sign] = [
      settingData.get("player1-symbol").toUpperCase(),
      settingData.get("player2-symbol").toUpperCase(),
    ];
    // Check If Max Round Is Valid
    if (!gameConfiguration.setMaxRound(maxRound)) {
      userInterface.displayErrorMessage("Max Round Should be Greater Than 0!");
      return;
    }
    // Check If Sign Is Valid
    if (player1Sign === player2Sign) {
      userInterface.displayErrorMessage(
        "Each Player Should Have Different Sign!"
      );
      return;
    }
    players.splice(0, players.length);
    setPlayer(1, player1Sign);
    setPlayer(2, player2Sign);
    start();
    userInterface.closeSettingForm();
  });

  userInterface.getBoardContainer().addEventListener("click", function (event) {
    // Check if board is enabled
    if (!gameBoard.isEnabled()) return;
    const tile = event.target.closest(".game-tile");
    if (!tile) return;
    const id = tile.dataset.id;
    makeMove(id);
  });

  userInterface.getNewGameBtn().addEventListener("click", function (event) {
    event.preventDefault();
    userInterface.hideVictor();
    userInterface.openSettingForm();
  });
})();

// start game
// set player and its data ✅
// clean ui (score✅, player symbol✅, game tiles✅)
// enable game tile✅
// Update Player Turn

// on click tile
// check which player turn and get sign
// check if the board is already signed
// if not then sign
// if signed then return null
