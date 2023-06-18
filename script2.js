let area = document.querySelector(".area");
let gridSize = 3;
let cellWidth = "100px";
let cellHeight = "100px";
let fontSize = "70px";

function createInitialGrid() {
  let areaElement = document.querySelector(".area");

  for (let i = 1; i <= gridSize * gridSize; i++) {
    let newCell = document.createElement("div");

    newCell.className = "cell";
    newCell.setAttribute("data-position", i);
    newCell.style.width = cellWidth;
    newCell.style.height = cellHeight;
    areaElement.style.fontSize = fontSize;
    area.appendChild(newCell);
  }

  enableClicks();

  areaElement.style.gridTemplateColumns = `repeat(${gridSize}, auto)`;
}

function handleModeClick(event) {
  let modeElement = event.target;
  if (modeElement.classList.contains("change-mode")) {
    let mode = modeElement.classList[1];
    if (mode === "threeByThree") {
      gridSize = 3;
      cellWidth = "100px";
      cellHeight = "100px";
      fontSize = "70px";
    } else if (mode === "fourByFour") {
      gridSize = 4;
      cellWidth = "90px";
      cellHeight = "90px";
      fontSize = "70px";
    } else if (mode === "fiveByFive") {
      gridSize = 5;
      cellWidth = "80px";
      cellHeight = "80px";
      fontSize = "60px";
    }

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

    let data = [];

    for (var i in cell) {
      if (cell[i].innerHTML == player) {
        data.push(parseInt(cell[i].getAttribute("data-position")));
      }
    }

    if (player === "X") {
      player = "O";
      document.querySelector(".bg").style.left = "85px";
      document.querySelector(".bg").style.backgroundColor = "#fe019a";
    } else {
      player = "X";
      document.querySelector(".bg").style.left = "";
      document.querySelector(".bg").style.backgroundColor = "#019afe";
    }

    let currentPlayer = player === "X" ? "O" : "X";

    if (checkWin(data)) {
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

function checkWin(data) {
  let winningPositions = getWinningPositions();

  for (let positions of winningPositions) {
    let [pos1, pos2, pos3] = positions;
    if (data.includes(pos1) && data.includes(pos2) && data.includes(pos3)) {
      let winningCells = [pos1, pos2, pos3];
      highlightWinningCells(winningCells);
      return true;
    }
  }

  return false;
}

function getWinningPositions() {
  let winningPositions = [];

  for (let row = 0; row < gridSize; row++) {
    let positions = [];
    for (let col = 0; col < gridSize; col++) {
      positions.push(row * gridSize + col + 1);
    }
    winningPositions.push(positions);
  }

  for (let col = 0; col < gridSize; col++) {
    let positions = [];
    for (let row = 0; row < gridSize; row++) {
      positions.push(row * gridSize + col + 1);
    }
    winningPositions.push(positions);
  }

  let diagonal = [];
  for (let i = 0; i < gridSize; i++) {
    diagonal.push(i * gridSize + i + 1);
  }
  winningPositions.push(diagonal);

  let diagonalReverse = [];
  for (let i = 0; i < gridSize; i++) {
    diagonalReverse.push((i + 1) * gridSize - i);
  }
  winningPositions.push(diagonalReverse);

  return winningPositions;
}

function checkDraw() {
  let draw = true;
  for (let i in cell) {
    if (cell[i].innerHTML == "") draw = false;
  }
  if (draw) return true;
}

function highlightWinningCells(winningCells) {
  for (let i = 0; i < cell.length; i++) {
    let cellPosition = parseInt(cell[i].getAttribute("data-position"));
    if (winningCells.includes(cellPosition)) {
      cell[i].classList.add("winning-cell");
      // currentPlayer?
      if (player === "O") {
        cell[i].style.backgroundColor = "#019afe";
      } else {
        cell[i].style.backgroundColor = "#fe019a";
      }
    }
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
