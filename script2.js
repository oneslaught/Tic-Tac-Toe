let area = document.querySelector(".area");
let gridSize = 3;
if (document.documentElement.clientWidth <= 300) {
  fontSize = "50px";
  document.querySelector(".turn-container").style.display = "none";
  document.querySelector(".turn-container-mobile").style.display = "block";
} else if (document.documentElement.clientWidth <= 480) {
  fontSize = "66px";
  document.querySelector(".turn-container").style.display = "none";
  document.querySelector(".turn-container-mobile").style.display = "block";
} else {
  fontSize = "80px";
  document.querySelector(".turn-container").style.display = "grid";
  document.querySelector(".turn-container-mobile").style.display = "none";
}
let isFirstClick = false;
let board = [];
for (let i = 0; i < gridSize; i++) {
  board.push(Array(gridSize).fill(""));
}

function createInitialGrid() {
  let areaElement = document.querySelector(".area");

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let newCell = document.createElement("div");

      newCell.className = "cell";
      newCell.setAttribute("data-positionX", i);
      newCell.setAttribute("data-positionY", j);
      newCell.addEventListener("click", handlePlayerCellClick, false);
      areaElement.style.fontSize = fontSize;
      area.appendChild(newCell);
    }
  }

  areaElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  if ((isEasyBotModeSelected() || isHardBotModeSelected()) && player === "O") {
    hardBotMove();
  }
}

function handleModeClick(event) {
  let modeElement = event.target;
  if (modeElement.classList.contains("change-mode")) {
    let mode = modeElement.classList[1];

    resetStatistics();

    switch (mode) {
      case "threeByThree":
        gridSize = 3;
        if (document.documentElement.clientWidth <= 300) {
          fontSize = "50px";
        } else if (document.documentElement.clientWidth <= 480) {
          fontSize = "66px";
        } else {
          fontSize = "80px";
        }
        break;
      case "fiveByFive":
        gridSize = 5;
        if (document.documentElement.clientWidth <= 300) {
          fontSize = "26px";
        } else if (document.documentElement.clientWidth <= 480) {
          fontSize = "36px";
        } else {
          fontSize = "48px";
        }
        break;
      default:
        gridSize = 3;
        if (document.documentElement.clientWidth <= 480) {
          fontSize = "30px";
        } else {
          fontSize = "80px";
        }
        break;
    }

    board = Array.from({ length: gridSize }, () => Array(gridSize).fill(""));

    area.innerHTML = "";
    createInitialGrid();
  }
}

let modeElements = document.querySelectorAll(".change-mode");

modeElements.forEach((modeElement) => {
  modeElement.addEventListener("click", handleModeClick);
});

let cell = document.getElementsByClassName("cell");
let playAgainButton = document.getElementById("play-again");
let exitButton = document.getElementById("exit");

document.addEventListener("DOMContentLoaded", function () {
  let cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("mouseover", handleCellMouseOver);
  });

  function handleCellMouseOver(event) {
    let cell = event.target;

    if (!cell.classList.contains("winning-cell") && !checkWin()) {
      if (cell.textContent === "") {
        cell.classList.add("hover");
      }
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener("mouseout", handleCellMouseOut);
  });

  function handleCellMouseOut(event) {
    let cell = event.target;
    if (!cell.classList.contains("winning-cell")) {
      cell.classList.remove("hover");
    } else {
      cell.style.backgroundColor =
        currentPlayer === "X" ? "#019afe" : "#fe019a";
    }
  }
});

let shouldRunHardBotMove = true;

function playAgain() {
  clearTimeout(timeOutId);
  timeOutId = null;

  for (let i = 0; i < cell.length; i++) {
    cell[i].textContent = "";
    document.querySelector(".results").innerHTML = "";
    playAgainButton.classList.remove("show");
    playAgainButton.style.visibility = "hidden";
    modeElements.forEach((modeElement) => {
      modeElement.style.visibility = "visible";
    });
    document.querySelectorAll(".change-game-mode").forEach((element) => {
      element.style.visibility = "visible";
    });

    isFirstClick = false;
    ["x-score", "o-score", "draw-score"].forEach((scoreClass) => {
      document.querySelector(`.${scoreClass}`).classList.remove("shake");
    });
    removeWinningCellClass();
    board = [];
    for (let i = 0; i < gridSize; i++) {
      board.push(Array(gridSize).fill(""));
    }

    exitButton.classList.remove("show");
    exitButton.style.display = "none";

    if (
      shouldRunHardBotMove &&
      (isEasyBotModeSelected() || isHardBotModeSelected())
    ) {
      if (currentPlayer === "X") {
        document.querySelector(".bg").style.left = "";
        document.querySelector(".bg").style.backgroundColor = "#019afe";
        document.getElementById("highlight-current-player").classList.add("x");
        document
          .getElementById("highlight-current-player")
          .classList.remove("o");

        document.getElementById(
          "highlight-current-player"
        ).textContent = `${player}`;
      } else {
        document.querySelector(".bg").style.left = "85px";
        document.querySelector(".bg").style.backgroundColor = "#fe019a";
        document
          .getElementById("highlight-current-player")
          .classList.toggle("o");
        document
          .getElementById("highlight-current-player")
          .classList.remove("x");

        document.getElementById(
          "highlight-current-player"
        ).textContent = `${player}`;
      }
    }
  }
  if (!isEasyBotModeSelected() && !isHardBotModeSelected()) {
    player = player === "X" ? "O" : "X";
    currentPlayer = player;
    setCurrentPlayerDisplay();
  }
  if (
    shouldRunHardBotMove &&
    (isEasyBotModeSelected() || isHardBotModeSelected()) &&
    player === "O"
  ) {
    currentPlayer = "X";
    hardBotMove();
  }
  if ((isEasyBotModeSelected() || isHardBotModeSelected()) && player === "X") {
    currentPlayer = "X";
  }
  // console.log(`Current player: ${currentPlayer}, player: ${player}`);
}

function exitBotMode() {
  shouldRunHardBotMove = false;
  playAgain();
  resetStatistics();
  exitButton.classList.remove("show");
  exitButton.style.display = "none";
  document.querySelector(".change-game-mode.local").classList.add("clicked");
  document
    .querySelector(".change-game-mode.easy-bot")
    .classList.remove("clicked");
  document
    .querySelector(".change-game-mode.hard-bot")
    .classList.remove("clicked");
  document.querySelector(".change-mode.threeByThree").classList.add("clicked");
  document.querySelector(".change-mode.fiveByFive").classList.remove("clicked");
}

playAgainButton.addEventListener("click", () => {
  playAgain();
});

exitButton.addEventListener("click", () => {
  exitBotMode();
});

let currentPlayer = "X";
let player = "X";
let timeOutId;
document.getElementById("highlight-current-player").classList.add("x");

createInitialGrid();

let clickSoundX = document.getElementById("clickSoundX");
let clickSoundO = document.getElementById("clickSoundO");
let winSound = document.getElementById("clickSoundWin");
let drawSound = document.getElementById("clickSoundDraw");

window.addEventListener("load", () => {
  clickSoundX.load();
  clickSoundO.load();
  winSound.load();
  drawSound.load();
});

function isPlayerTurn() {
  return player === currentPlayer;
}

function handlePlayerCellClick(event) {
  if (!checkWin() && !checkDraw()) {
    if (!isEasyBotModeSelected()) {
      if (!isHardBotModeSelected()) {
        let clickedCell = event.target;
        if (clickedCell.classList.contains("cell") && !clickedCell.textContent) {
          handleCellClick(event, player);
          player = currentPlayer;
        }
      }
    }
    if (isPlayerTurn()) {
      if (isEasyBotModeSelected()) {
        let clickedCell = event.target;
        if (clickedCell.classList.contains("cell") && !clickedCell.textContent) {
          handleCellClick(event, player);
          if (!checkWin() && !checkDraw()) {
            timeOutId = setTimeout(() => {
              easyBotMove();
              timeOutId = null;
            }, 1000);
          }
        }
      } else if (isHardBotModeSelected()) {
        let clickedCell = event.target;
        if (clickedCell.classList.contains("cell") && !clickedCell.textContent) {
          handleCellClick(event, player);
          if (!checkWin() && !checkDraw()) {
            timeOutId = setTimeout(() => {
              hardBotMove();
              timeOutId = null;
            }, 1000);
          }
        }
      }
    }
  }
}

function setCurrentPlayerDisplay() {
  if (currentPlayer === "O") {
    document.querySelector(".bg").style.left = "85px";
    document.querySelector(".bg").style.backgroundColor = "#fe019a";
    document.getElementById("highlight-current-player").classList.add("o");
    document.getElementById("highlight-current-player").classList.remove("x");
  } else {
    document.querySelector(".bg").style.left = "";
    document.querySelector(".bg").style.backgroundColor = "#019afe";
    document.getElementById("highlight-current-player").classList.add("x");
    document.getElementById("highlight-current-player").classList.remove("o");
  }

  document.getElementById(
    "highlight-current-player"
  ).textContent = `${currentPlayer}`;
}

function handleCellClick(event, activePlayer) {
  // console.log(`Current player: ${currentPlayer}, player: ${player}`);
  let clickedCell = event.target;
  if (clickedCell.classList.contains("cell") && !clickedCell.innerHTML) {
    let currentPlayerColor = activePlayer === "X" ? "#019afe" : "#fe019a";

    clickedCell.style.color = currentPlayerColor;
    clickedCell.innerHTML = activePlayer;

    if (!isFirstClick) {
      modeElements.forEach((modeElement) => {
        modeElement.style.visibility = "hidden";
      });
      document.querySelectorAll(".change-game-mode").forEach((element) => {
        element.style.visibility = "hidden";
      });
      isFirstClick = true;
    }

    let positionX = parseInt(clickedCell.getAttribute("data-positionX"));
    let positionY = parseInt(clickedCell.getAttribute("data-positionY"));
    board[positionX][positionY] = activePlayer;

    if (checkWin()) {
      statistics[currentPlayer] += 1;
      winSound.currentTime = 0;
      winSound.play();

      playAgainButton.classList.add("show");
      playAgainButton.style.visibility = "visible";
      if (
        (isEasyBotModeSelected() || isHardBotModeSelected()) &&
        player === "O"
      ) {
        exitButton.classList.add("show");
        exitButton.style.display = "block";
      }
      if (currentPlayer === "X") {
        document.querySelector(".x-score").classList.add("shake");
        document.querySelector(".results").innerHTML = `<div class="signX">
        <span class="fast-flickerX">${currentPlayer}  </span>w<span class="flickerX">o</span>n
        </div>`;
      } else if (currentPlayer === "O") {
        document.querySelector(".o-score").classList.add("shake");
        document.querySelector(".results").innerHTML = `<div class="sign">
        <span class="fast-flicker">${currentPlayer}  </span>w<span class="flicker">o</span>n
        </div>`;
      }
      updateStatistics();
    } else if (checkDraw()) {
      statistics.D += 1;
      drawSound.currentTime = 0;
      drawSound.play();

      document.querySelector(".results").innerHTML = `<div class="signD">
      <span class="fast-flickerD">D</span>r<span class="flickerD">a</span>w
      </div>`;
      playAgainButton.classList.add("show");
      playAgainButton.style.visibility = "visible";
      if (
        (isEasyBotModeSelected() || isHardBotModeSelected()) &&
        player === "O"
      ) {
        exitButton.classList.add("show");
        exitButton.style.display = "block";
      }
      updateStatistics();

      document.querySelector(".draw-score").classList.add("shake");
    } else {
      if (currentPlayer === "X") {
        currentPlayer = "O";
        clickSoundX.currentTime = 0;
        clickSoundX.play();
      } else {
        currentPlayer = "X";
        clickSoundO.currentTime = 0;
        clickSoundO.play();
      }

      setCurrentPlayerDisplay();
    }
    return true;
  }
  return false;
}

function checkWin() {
  if (gridSize === 3) {
    for (let i = 0; i < gridSize; i++) {
      if (
        board[i][0] !== "" &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        setTimeout(() => {
          highlightWinningCells([
            [i, 0],
            [i, 1],
            [i, 2],
          ]);
        }, 1);
        return true;
      }
    }

    for (let j = 0; j < gridSize; j++) {
      if (
        board[0][j] !== "" &&
        board[0][j] === board[1][j] &&
        board[1][j] === board[2][j]
      ) {
        setTimeout(() => {
          highlightWinningCells([
            [0, j],
            [1, j],
            [2, j],
          ]);
        }, 1);
        return true;
      }
    }

    if (
      board[0][0] !== "" &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      setTimeout(() => {
        highlightWinningCells([
          [0, 0],
          [1, 1],
          [2, 2],
        ]);  
      }, 1);
      return true;
    }

    if (
      board[0][2] !== "" &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      setTimeout(() => {
        highlightWinningCells([
          [0, 2],
          [1, 1],
          [2, 0],
        ]);  
      }, 1);
      return true;
    }

    return false;
  } else if (gridSize === 5) {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize - 3; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i][j + 1] &&
          board[i][j + 1] === board[i][j + 2] &&
          board[i][j + 2] === board[i][j + 3]
        ) {
          setTimeout(() => {
            highlightWinningCells([
              [i, j],
              [i, j + 1],
              [i, j + 2],
              [i, j + 3],
            ]);
          }, 1);
          return true;
        }
      }
    }

    for (let i = 0; i < gridSize - 3; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i + 1][j] &&
          board[i + 1][j] === board[i + 2][j] &&
          board[i + 2][j] === board[i + 3][j]
        ) {
          setTimeout(() => {
            highlightWinningCells([
              [i, j],
              [i + 1, j],
              [i + 2, j],
              [i + 3, j],
            ]);
          }, 1);
          return true;
        }
      }
    }

    for (let i = 0; i < gridSize - 3; i++) {
      for (let j = 0; j < gridSize - 3; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i + 1][j + 1] &&
          board[i + 1][j + 1] === board[i + 2][j + 2] &&
          board[i + 2][j + 2] === board[i + 3][j + 3]
        ) {
          setTimeout(() => {
            highlightWinningCells([
              [i, j],
              [i + 1, j + 1],
              [i + 2, j + 2],
              [i + 3, j + 3],
            ]);
          }, 1);
          return true;
        }
      }
    }

    for (let i = 0; i < gridSize - 3; i++) {
      for (let j = 3; j < gridSize; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i + 1][j - 1] &&
          board[i + 1][j - 1] === board[i + 2][j - 2] &&
          board[i + 2][j - 2] === board[i + 3][j - 3]
        ) {
          setTimeout(() => {
            highlightWinningCells([
              [i, j],
              [i + 1, j - 1],
              [i + 2, j - 2],
              [i + 3, j - 3],
            ]);
          }, 1);
          return true;
        }
      }
    }
  }

  return false;
}

function checkDraw() {
  let draw = true;
  for (let i in cell) {
    if (cell[i].innerHTML == "") draw = false;
    ``;
  }
  return draw;
}

function highlightWinningCells(cells) {
  let currentPlayerColor = currentPlayer === "X" ? "#019afe" : "#fe019a";
  let isEqual = cells.every(([row, col]) => board[row][col] === currentPlayer);

  if (isEqual) {
    for (let i = 0; i < cells.length; i++) {
      const [row, col] = cells[i];
      const cell = document.querySelector(
        `.cell[data-positionX="${row}"][data-positionY="${col}"]`
      );
      cell.classList.add("winning-cell");
      cell.style.color = "#fff";
      cell.style.backgroundColor = currentPlayerColor;
    }
  }
}

function removeWinningCellClass() {
  for (let i = 0; i < cell.length; i++) {
    cell[i].classList.remove("winning-cell");
    cell[i].style.backgroundColor = "";
  }
}

let statistics = {
  X: 0,
  D: 0,
  O: 0,
};

function updateStatistics() {
  document.getElementById("x-score").innerHTML = statistics.X;
  document.getElementById("draw-score").innerHTML = statistics.D;
  document.getElementById("o-score").innerHTML = statistics.O;
}

function resetStatistics() {
  statistics.X = 0;
  statistics.D = 0;
  statistics.O = 0;
  updateStatistics();
}

let modeContainerButtons = document.querySelectorAll(
  ".mode-container .change-mode"
);
let gameModeContainerButtons = document.querySelectorAll(
  ".game-mode-container .change-game-mode"
);

modeContainerButtons.forEach((button) => {
  button.addEventListener("click", handleModeButtonClick);
});

gameModeContainerButtons.forEach((button) => {
  button.addEventListener("click", handleGameModeButtonClick);
});

function handleModeButtonClick(event) {
  modeContainerButtons.forEach((button) => {
    if (button !== event.target) {
      button.classList.remove("clicked");
    }
  });

  event.target.classList.add("clicked");

  resetStatistics();
}

function handleGameModeButtonClick(event) {
  gameModeContainerButtons.forEach((button) => {
    if (button !== event.target) {
      button.classList.remove("clicked");
    }
  });

  event.target.classList.add("clicked");

  resetStatistics();
}

let popup = document.getElementById("popup");
let xPopup = document.querySelector(".x-popup");
let oPopup = document.querySelector(".o-popup");
let choosePlayers = document.querySelectorAll(".choose-player");
let bots = document.querySelectorAll("#bots");
let overlay = document.getElementById("overlay");

function openPopup() {
  popup.classList.add("open-popup");
  overlay.classList.add("active");
}

function closePopup() {
  popup.classList.remove("open-popup");
  overlay.classList.remove("active");
}

xPopup.addEventListener("click", () => {
  player = "X";
  currentPlayer = player;
  // console.log(`Current player: ${currentPlayer}, player: ${player}`);
  document.querySelector(".bg").style.left = "";
  document.querySelector(".bg").style.backgroundColor = "#019afe";
  document.getElementById("highlight-current-player").classList.add("x");
  document.getElementById("highlight-current-player").classList.remove("o");

  document.getElementById("highlight-current-player").textContent = `${player}`;
});

oPopup.addEventListener("click", () => {
  player = "O";
  document.querySelector(".bg").style.left = "85px";
  document.querySelector(".bg").style.backgroundColor = "#fe019a";
  document.getElementById("highlight-current-player").classList.toggle("o");
  document.getElementById("highlight-current-player").classList.remove("x");

  document.getElementById("highlight-current-player").textContent = `${player}`;
  shouldRunHardBotMove = true;
  hardBotMove();
});

bots.forEach((bot) => {
  bot.addEventListener("click", openPopup);
});

choosePlayers.forEach((choosePlayer) => {
  choosePlayer.addEventListener("click", closePopup);
});

function easyBotMove() {
  if (checkWin()) {
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";

  let winningMoves = [];
  let blockingMoves = [];
  let availableMoves = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === "") {
        board[i][j] = currentPlayer;
        if (checkWin()) {
          winningMoves.push({ row: i, col: j });
        }
        board[i][j] = player;
        if (checkWin()) {
          blockingMoves.push({ row: i, col: j });
        }
        board[i][j] = "";
        availableMoves.push({ row: i, col: j });
      }
    }
  }

  let errorProbability = Math.random() <= 0.3;

  let targetMove;
  if (
    !errorProbability &&
    (winningMoves.length > 0 || blockingMoves.length > 0)
  ) {
    targetMove =
      winningMoves.length > 0
        ? winningMoves[Math.floor(Math.random() * winningMoves.length)]
        : blockingMoves[Math.floor(Math.random() * blockingMoves.length)];
  } else {
    targetMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  let targetCell = document.querySelector(
    `.cell[data-positionX="${targetMove.row}"][data-positionY="${targetMove.col}"]`
  );

  if (targetCell && !targetCell.textContent) {
    handleCellClick({ target: targetCell }, currentPlayer);
  }
}


function hardBotMoveLogic() {
  let move;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === "") {
        board[i][j] = currentPlayer;
        if (checkWin()) {
          move = { row: i, col: j };
          board[i][j] = "";
          // console.log("Found winning move at:", move);
          return move;
        }
        board[i][j] = "";
      }
    }
  }

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === "") {
        board[i][j] = player;
        if (checkWin()) {
          move = { row: i, col: j };
          board[i][j] = "";
          // console.log("Found blocking move at:", move);
          return move;
        }
        board[i][j] = "";
      }
    }
  }

  let centerOccupied =
    board[Math.floor(gridSize / 2)][Math.floor(gridSize / 2)] === player;
  let centerEmpty =
    board[Math.floor(gridSize / 2)][Math.floor(gridSize / 2)] === "";
  let cornerOccupied =
    board[0][0] === player ||
    board[0][gridSize - 1] === player ||
    board[gridSize - 1][0] === player ||
    board[gridSize - 1][gridSize - 1] === player;

  let corners = [
    { row: 0, col: 0 },
    { row: 0, col: gridSize - 1 },
    { row: gridSize - 1, col: 0 },
    { row: gridSize - 1, col: gridSize - 1 },
  ];

  if (centerOccupied && cornerOccupied) {
    let availableCorners = corners.filter(
      (corner) => board[corner.row][corner.col] === ""
    );
    if (availableCorners.length > 0) {
      move =
        availableCorners[Math.floor(Math.random() * availableCorners.length)];
      return move;
    }
  }

  if (centerOccupied) {
    move = corners[Math.floor(Math.random() * corners.length)];
    return move;
  }

  if (centerEmpty) {
    move = { row: Math.floor(gridSize / 2), col: Math.floor(gridSize / 2) };
    return move;
  }

  if (board[0][1] === player && board[1][0] === player) {
    return { row: 0, col: 0 };
  } else if (board[0][1] === player && board[1][2] === player) {
    return { row: 0, col: 2 };
  } else if (board[2][1] === player && board[1][0] === player) {
    return { row: 2, col: 0 };
  } else if (board[2][1] === player && board[1][2] === player) {
    return { row: 2, col: 2 };
  }

  let availableMoves = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (board[i][j] === "") {
        availableMoves.push({ row: i, col: j });
      }
    }
  }

  move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  // console.log("No specific moves found, choosing random move.");
  return move;
}

function hardBotMove() {
  if (checkWin()) {
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  let move = hardBotMoveLogic();

  // console.log(`Bot moved to cell: [${move.row}, ${move.col}]`);

  let targetCell = document.querySelector(
    `.cell[data-positionX="${move.row}"][data-positionY="${move.col}"]`
  );

  if (targetCell && !targetCell.textContent) {
    handleCellClick({ target: targetCell }, currentPlayer);
  } else {
    let availableCells = document.querySelectorAll(
      ".cell:not(.winning-cell):empty"
    );
    if (availableCells.length > 0) {
      let randomCell =
        availableCells[Math.floor(Math.random() * availableCells.length)];
      handleCellClick({ target: randomCell }, currentPlayer);
    }
  }
}

function isLocalModeSelected() {
  let localModeButton = document.querySelector(".change-game-mode.local");
  return localModeButton.classList.contains("clicked");
}

function isOnlineModeSelected() {
  let onlineModeButton = document.querySelector(".change-game-mode.online");
  return onlineModeButton.classList.contains("clicked");
}

function isEasyBotModeSelected() {
  let easyBotButton = document.querySelector(".change-game-mode.easy-bot");
  return easyBotButton.classList.contains("clicked");
}

function isHardBotModeSelected() {
  let hardBotButton = document.querySelector(".change-game-mode.hard-bot");
  return hardBotButton.classList.contains("clicked");
}
