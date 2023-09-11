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
      areaElement.style.fontSize = fontSize;
      area.appendChild(newCell);
    }
  }

  enableClicks();

  areaElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
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

document.addEventListener("DOMContentLoaded", function () {
  let cells = document.querySelectorAll(".cell");

  cells.forEach((cell) => {
    cell.addEventListener("mouseover", handleCellMouseOver);
  });

  function handleCellMouseOver(event) {
    let cell = event.target;

    if (!cell.classList.contains("winning-cell") && !checkWin()) {
      if (cell.textContent === "") {
        cell.style.backgroundColor = "rgb(228, 226, 226)";
      }
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener("mouseout", handleCellMouseOut);
  });

  function handleCellMouseOut(event) {
    let cell = event.target;
    if (!cell.classList.contains("winning-cell")) {
      cell.style.backgroundColor = "";
    } else {
      let currentPlayer = player === "X" ? "#fe019a" : "#019afe";
      cell.style.backgroundColor = currentPlayer;
    }
  }
});

playAgainButton.addEventListener("click", () => {
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
    enableClicks();
    removeWinningCellClass();
    board = [];
    for (let i = 0; i < gridSize; i++) {
      board.push(Array(gridSize).fill(""));
    }

    if (isEasyBotModeSelected() || isHardBotModeSelected()) {
      player = currentPlayer;
      if (currentPlayer === "X") {
        document.querySelector(".bg").style.left = "";
        document.querySelector(".bg").style.backgroundColor = "#019afe";
        document.getElementById("highlight-current-player").classList.add("x");
        document.getElementById("highlight-current-player").classList.remove("o");

        document.getElementById(
          "highlight-current-player"
        ).textContent = `${player}`;
      } else {
        document.querySelector(".bg").style.left = "85px";
        document.querySelector(".bg").style.backgroundColor = "#fe019a";
        document.getElementById("highlight-current-player").classList.toggle("o");
        document.getElementById("highlight-current-player").classList.remove("x");

        document.getElementById(
          "highlight-current-player"
        ).textContent = `${player}`;
      }
      isPlayerTurn = true;
    }
  }
});


let currentPlayer = "X";
let player = "X";
let isPlayerTurn = true;
document.getElementById("highlight-current-player").classList.add("x");

function enableClicks() {
  Array.from(cell).forEach((actualCell) => {
    actualCell.addEventListener("click", handleCellClick, false);
  });
}

createInitialGrid();

function disableClicks() {
  Array.from(cell).forEach((actualCell) => {
    actualCell.removeEventListener("click", handleCellClick, false);
  });
}

let clickSoundX = document.getElementById("clickSoundX");
let clickSoundO = document.getElementById("clickSoundO");
let winSound = document.getElementById("clickSoundWin");

window.addEventListener("load", () => {
  clickSoundX.load();
  clickSoundO.load();
  winSound.load();
});

function handleCellClick(event) {
  let clickedCell = event.target;
  if (clickedCell.classList.contains("cell") && !clickedCell.innerHTML) {
    let currentPlayerColor = player === "X" ? "#019afe" : "#fe019a";

    clickedCell.style.color = currentPlayerColor;
    clickedCell.innerHTML = player;

    enableClicks();

    if (!checkWin() && !checkDraw() && isEasyBotModeSelected()) {
      disableClicks();
      isPlayerTurn = false;

      setTimeout(() => {
        easyBotMove();

        setTimeout(() => {
          if (!checkWin() || checkDraw()) {
            enableClicks();
          }
        }, 0);
      }, 1000);
    }

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
    board[positionX][positionY] = player;

    if (player === "X") {
      player = "O";
      clickSoundX.currentTime = 0;
      clickSoundX.play();
      document.querySelector(".bg").style.left = "85px";
      document.querySelector(".bg").style.backgroundColor = "#fe019a";
      document.getElementById("highlight-current-player").classList.toggle("o");
      document.getElementById("highlight-current-player").classList.remove("x");
    } else {
      player = "X";
      clickSoundO.currentTime = 0;
      clickSoundO.play();
      document.querySelector(".bg").style.left = "";
      document.querySelector(".bg").style.backgroundColor = "#019afe";
      document.getElementById("highlight-current-player").classList.add("x");
      document.getElementById("highlight-current-player").classList.remove("o");
    }

    document.getElementById(
      "highlight-current-player"
    ).textContent = `${player}`;

    if (checkWin()) {
      let currentPlayer = player === "X" ? "O" : "X";
      statistics[currentPlayer] += 1;
      winSound.currentTime = 0;
      winSound.play();

      playAgainButton.classList.add("show");
      playAgainButton.style.visibility = "visible";
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
      disableClicks();
      updateStatistics();
    } else if (checkDraw()) {
      statistics.D += 1;

      document.querySelector(".results").innerHTML = `<div class="signD">
      <span class="fast-flickerD">D</span>r<span class="flickerD">a</span>w
      </div>`;
      playAgainButton.classList.add("show");
      playAgainButton.style.visibility = "visible";
      updateStatistics();

      document.querySelector(".draw-score").classList.add("shake");
    }
  }
}

function checkWin() {
  if (gridSize === 3) {
    for (let i = 0; i < gridSize; i++) {
      if (
        board[i][0] !== "" &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        highlightWinningCells([
          [i, 0],
          [i, 1],
          [i, 2],
        ]);
        return true;
      }
    }

    for (let j = 0; j < gridSize; j++) {
      if (
        board[0][j] !== "" &&
        board[0][j] === board[1][j] &&
        board[1][j] === board[2][j]
      ) {
        highlightWinningCells([
          [0, j],
          [1, j],
          [2, j],
        ]);
        return true;
      }
    }

    if (
      board[0][0] !== "" &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      highlightWinningCells([
        [0, 0],
        [1, 1],
        [2, 2],
      ]);
      return true;
    }

    if (
      board[0][2] !== "" &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      highlightWinningCells([
        [0, 2],
        [1, 1],
        [2, 0],
      ]);
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
          highlightWinningCells([
            [i, j],
            [i, j + 1],
            [i, j + 2],
            [i, j + 3],
          ]);
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
          highlightWinningCells([
            [i, j],
            [i + 1, j],
            [i + 2, j],
            [i + 3, j],
          ]);
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
          highlightWinningCells([
            [i, j],
            [i + 1, j + 1],
            [i + 2, j + 2],
            [i + 3, j + 3],
          ]);
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
          highlightWinningCells([
            [i, j],
            [i + 1, j - 1],
            [i + 2, j - 2],
            [i + 3, j - 3],
          ]);
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
  }
  if (draw) return true;
}

function highlightWinningCells(cells) {
  let currentPlayer = player === "X" ? "O" : "X";
  let currentPlayerColor = currentPlayer === "X" ? "#019afe" : "#fe019a";
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

function removeWinningCellClass() {
  for (let i = 0; i < cell.length; i++) {
    cell[i].classList.remove("winning-cell");
    cell[i].style.backgroundColor = "";
  }
}

enableClicks();

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

  if (event.target.classList.contains("easy-bot")) {
    easyBotMove();
  }
}

let popup = document.getElementById("popup");
let xPopup = document.querySelector(".x-popup");
let oPopup = document.querySelector(".o-popup");
let choosePlayers = document.querySelectorAll(".choose-player");
let bots = document.querySelectorAll("#bots");
let overlay = document.getElementById("overlay");

function openPopup(event) {
  let currentPlayer = event.target.classList.contains("x-popup") ? "X" : "O";
  player = currentPlayer;
  popup.classList.add("open-popup");
  overlay.classList.add("active");
}

function closePopup() {
  popup.classList.remove("open-popup");
  overlay.classList.remove("active");
}

xPopup.addEventListener("click", () => {
  currentPlayer = "X";
  player = currentPlayer;
  document.querySelector(".bg").style.left = "";
  document.querySelector(".bg").style.backgroundColor = "#019afe";
  document.getElementById("highlight-current-player").classList.add("x");
  document.getElementById("highlight-current-player").classList.remove("o");

  document.getElementById("highlight-current-player").textContent = `${player}`;
});

oPopup.addEventListener("click", () => {
  currentPlayer = "O";
  player = currentPlayer;
  document.querySelector(".bg").style.left = "85px";
  document.querySelector(".bg").style.backgroundColor = "#fe019a";
  document.getElementById("highlight-current-player").classList.toggle("o");
  document.getElementById("highlight-current-player").classList.remove("x");

  document.getElementById("highlight-current-player").textContent = `${player}`;
});

bots.forEach((bot) => {
  bot.addEventListener("click", openPopup);
});

choosePlayers.forEach((choosePlayer) => {
  choosePlayer.addEventListener("click", closePopup);
});

function easyBotMove() {
  if (!isPlayerTurn) {
    if (checkWin()) {
      return;
    }
    let emptyCells = [];

    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (board[i][j] === "") {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      let randomIndex = Math.floor(Math.random() * emptyCells.length);
      let [row, col] = emptyCells[randomIndex];

      handleCellClick({
        target: document.querySelector(
          `.cell[data-positionX="${row}"][data-positionY="${col}"]`
        ),
      });

      isPlayerTurn = true;
    }
  }
}

function isEasyBotModeSelected() {
  let easyBotButton = document.querySelector(".change-game-mode.easy-bot");
  return easyBotButton.classList.contains("clicked");
}

function isHardBotModeSelected() {
  let hardBotButton = document.querySelector(".change-game-mode.hard-bot");
  return hardBotButton.classList.contains("clicked");
}