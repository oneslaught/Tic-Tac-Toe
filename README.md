# ❎ Tic-Tac-Toe

A classic game of tic-tac-toe built with vanilla JavaScript, SCSS and HTML. In this project there are no frameworks, no libraries, just the fundamental stuff (except SCSS). 
Building Tic-Tac-Toe was my way of getting comfortable with core web development concepts like DOM manipulation, event handling and game-logic algorithms before moving on to more complex, framework-based projects.

## 📀 Video

[Tic-Tac-Toe-demo.webm](https://github.com/user-attachments/assets/ec7167fa-045b-4f96-a6d2-472c3419ce4b)

## 📦 Technologies used
### Frontend:
- `JavaScript`
- `SCSS`
- `HTML`
### Development Tools:
- `VS Studio`
- `Git + GitHub`
### Deploy:
- `GitHub Pages`

## 🎮 Features

### 🔳 Two grid sizes
Play the classic 3x3 version, or switch to a 5x5 board where you need four marks in a row to win. Switching modes resets the board and the score. There was a third mode with 7x7 grid but, there were plenty of reasons to 
exclude it from final version of the game.

### 🧑‍🤝‍🧑 Local mode
Two players share the same device and take turns placing their marks. The active player is highlighted both in the turn indicator via a sliding background animation.

### 🦾 Bot modes

Before facing a bot, a popup lets you choose whether you want to play as ❌ or ⭕. If ⭕ is chosen - bot will be making first moves as ❌ in every new game until you press "EXIT" button.

Play against the computer in two difficulty levels:
- **🟩 Easy Bot** – mostly plays winning or blocking moves, but occasionally makes a mistake, so it's beatable.
- **🟪 Hard Bot** – follows a proper strategy: take a winning move if available, block the opponent's winning move, otherwise fall back to center/corner/edge heuristics so it's much harder to beat.

*But I made it so that the you actually do have a chance to win playing Hard Bot, as there is a very small chance for bot to make a mistake... but I didn't tell you that.*

### 📊 Score tracking
Wins for ❌, wins for ⭕ and draws are all tracked and displayed, with a little "shake" animation whenever the score updates.

### 📣 Sound effects
Distinct sounds play for placing an ❌, placing an ⭕, winning and drawing.

### 🪩 Visual feedback
Cells highlight on hover, and the winning combination of cells lights up and changes color once the game is won.

## 📜 What I Learned

While building this project, I got hands-on practice with a number of fundamental concepts:

### 🧩 DOM Manipulation
Creating the grid dynamically, attaching event listeners to cells, and updating classes and styles in response to user actions gave me a practical understanding of how to work with the DOM directly.

### 🧠 Game Logic & Algorithms
Writing win-detection logic that works for both a 3x3 board (rows, columns, diagonals) and a 5x5 board (four-in-a-row in any direction) taught me a lot about breaking a problem down into smaller and reusable checks.

### 🤖 Simple AI Heuristics
Implementing minimax algorithm was the hardest task (especially while struggling with in in 5x5 mode...), but the result was worth it in the end. Implementing Hard Bot was, actually, easier then the Easy one, as
Tic-Tac-Toe is a [solved game](https://en.wikipedia.org/wiki/Solved_game) and there are not many specific outcomes and strategies for players to win.

### 🎨 SCSS
Using SCSS variables and nesting helped me keep the styling organized and easier to maintain compared to writing plain CSS, especially with all the different states (hover, clicked, winning-cell) each element could be in.

## 📈 Overall Growth
This project was where I moved past following tutorials line by line and started building something on my own from scratch. 
Figuring out the game logic, structuring the code, and getting it to actually feel good to play taught me a lot about problem-solving in JavaScript. 
It also gave me the confidence to later rebuild the same idea with React and TypeScript in my next and more advanced [React Tic-Tac-Toe](https://github.com/oneslaught/React-Tic-Tac-Toe) project.

## 💡 How this project can be improved?
- Add an "unbeatable" bot difficulty using a full minimax algorithm. Improved? Absolutely! Boring? Yes.
- Add a dark/light theme switcher.
- Add a move history / replay feature so players can review a finished game.
- Add keyboard accessibility for placing marks without a mouse.
