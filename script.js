let area = document.querySelector(".area");

for (let i = 1; i <= 9; i++) {
  let newCell = document.createElement("div");
  newCell.className = "cell";
  newCell.setAttribute("data-position", i);
  area.appendChild(newCell);
}

let cell = document.getElementsByClassName("cell");
let restartButton = document.getElementById("restart");

restartButton.addEventListener("click", () => {
  for (let i = 0; i < cell.length; i++) {
    cell[i].textContent = "";
    document.querySelector(".results").innerHTML = "";
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
      document.querySelector(".bg").style.backgroundColor = "#f2b147";
    } else {
      player = "X";
      document.querySelector(".bg").style.left = "";
      document.querySelector(".bg").style.backgroundColor = "#f2b147";
    }

    let currentPlayer = player === "X" ? "O" : "X";

    if (checkWin(data)) {
      statistics[currentPlayer] += 1;
      document.querySelector(".results").innerHTML = `${currentPlayer} won!`;
      disableClicks();
      updateStatistics();
    } else if (checkDraw()) {
      statistics.D += 1;
      document.querySelector(".results").innerHTML = "Draw!";
      updateStatistics();
    }
  }
}

function checkWin(data) {
  let winVariants = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  let winningCells = [];

  for (let i in winVariants) {
    let win = true;
    for (let j in winVariants[i]) {
      let id = winVariants[i][j];
      let index = data.indexOf(id);

      if (index == -1) win = false;
    }
    if (win) {
      winningCells = winVariants[i];
      break;
    }
  }
  if (winningCells.length > 0) {
    highlightWinningCells(winningCells);
    return true;
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

function highlightWinningCells(winningCells) {
  for (let i = 0; i < cell.length; i++) {
    let cellPosition = parseInt(cell[i].getAttribute("data-position"));
    if (winningCells.includes(cellPosition)) {
      cell[i].classList.add("winning-cell");
      // currentPlayer?
      if (player === "O") {
        cell[i].style.backgroundColor = "#3cc4bf";
      } else {
        cell[i].style.backgroundColor = "#f2b147";
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
