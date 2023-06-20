let area = document.querySelector(".area");
let gridSize = 3;
let cellWidth = "100px";
let cellHeight = "100px";
if (document.documentElement.clientWidth <= 480) {
  fontSize = "66px";
} else {
  fontSize = "80px";
}
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

    switch (mode) {
      case "threeByThree":
        gridSize = 3;
        if (document.documentElement.clientWidth <= 480) {
          fontSize = "66px";
        } else {
          fontSize = "80px";
        }
        break;
      case "fourByFour":
        gridSize = 4;
        if (document.documentElement.clientWidth <= 480) {
          fontSize = "46px";
        } else {
          fontSize = "60px";
        }
        break;
      case "fiveByFive":
        gridSize = 5;
        if (document.documentElement.clientWidth <= 480) {
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

playAgainButton.addEventListener("click", () => {
  for (let i = 0; i < cell.length; i++) {
    cell[i].textContent = "";
    document.querySelector(".results").innerHTML = "";
    playAgainButton.classList.remove("show");
    playAgainButton.style.visibility = "hidden";
    ["x-score", "o-score", "draw-score"].forEach((scoreClass) => {
      document.querySelector(`.${scoreClass}`).classList.remove("shake");
    });
    enableClicks();
    removeWinningCellClass();
    board = [];
    for (let i = 0; i < gridSize; i++) {
      board.push(Array(gridSize).fill(""));
    }
  }
});

let player = "X";

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

function handleCellClick(event) {
  let clickedCell = event.target;
  if (clickedCell.classList.contains("cell") && !clickedCell.innerHTML) {
    clickedCell.innerHTML = player;

    let positionX = parseInt(clickedCell.getAttribute("data-positionX"));
    let positionY = parseInt(clickedCell.getAttribute("data-positionY"));
    board[positionX][positionY] = player;
    console.log(board);

    if (player === "X") {
      player = "O";
      document.querySelector(".bg").style.left = "85px";
      document.querySelector(".bg").style.backgroundColor = "#fe019a";
    } else {
      player = "X";
      document.querySelector(".bg").style.left = "";
      document.querySelector(".bg").style.backgroundColor = "#019afe";
    }

    if (checkWin()) {
      let currentPlayer = player === "X" ? "O" : "X";
      statistics[currentPlayer] += 1;

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
  } else if (gridSize === 4) {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize - 2; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i][j + 1] &&
          board[i][j + 1] === board[i][j + 2]
        ) {
          highlightWinningCells([
            [i, j],
            [i, j + 1],
            [i, j + 2],
          ]);
          return true;
        }
      }
    }

    for (let i = 0; i < gridSize - 2; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i + 1][j] &&
          board[i + 1][j] === board[i + 2][j]
        ) {
          highlightWinningCells([
            [i, j],
            [i + 1, j],
            [i + 2, j],
          ]);
          return true;
        }
      }
    }

    for (let i = 0; i < gridSize - 2; i++) {
      for (let j = 0; j < gridSize - 2; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i + 1][j + 1] &&
          board[i + 1][j + 1] === board[i + 2][j + 2]
        ) {
          highlightWinningCells([
            [i, j],
            [i + 1, j + 1],
            [i + 2, j + 2],
          ]);
          return true;
        }
      }
    }

    for (let i = 0; i < gridSize - 2; i++) {
      for (let j = 2; j < gridSize; j++) {
        if (
          board[i][j] !== "" &&
          board[i][j] === board[i + 1][j - 1] &&
          board[i + 1][j - 1] === board[i + 2][j - 2]
        ) {
          highlightWinningCells([
            [i, j],
            [i + 1, j - 1],
            [i + 2, j - 2],
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
