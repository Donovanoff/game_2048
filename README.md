# 🧩 2048 Game

![2048 Game](https://img.shields.io/badge/Status-Completed-success?style=flat-square) ![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black) ![SCSS](https://img.shields.io/badge/SCSS-Styled-CC6699?style=flat-square&logo=sass&logoColor=white)

A fully functional, web-based clone of the classic **2048** puzzle game built entirely from scratch using Vanilla JavaScript, HTML5, and SCSS. 

🎮 **[Play the Demo Here!](https://Donovanoff.github.io/game_2048/)**

## ✨ Features

- **Classic Gameplay:** Standard 4x4 grid. Merge tiles with the same number to double their value and reach the elusive 2048 tile! (You can also choose to keep playing endlessly!)
- **Game Persistence (Save & Resume):** The game board and score are automatically saved in `localStorage`. Close the browser and seamlessly resume your session later via a beautifully styled custom dialog.
- **Undo Mechanic:** Made a mistake? Use the custom "Undo" (1 step back) button to revert your last move. It features a strategic 15-move cooldown with a dynamic visual recharge bar and state persistence.
- **Progressive Web App (PWA):** Install the game directly to your mobile Home Screen! Runs in full-screen standalone mode with custom SVG/high-res PNG app icons and forced portrait orientation lock.
- **Advanced Mobile UX:** 
  - Proportional CSS layout scaling (`clamp()`, `vw`) ensuring a pixel-perfect fit on any screen size.
  - Native browser scrolling is disabled during gameplay (`touch-action: none`) for flawless swipe gesture control.
- **Keyboard Navigation:** Play comfortably using the `Arrow Keys` or `W`, `A`, `S`, `D`.
- **Score Tracking:** Keeps track of your current score and saves your **Best Score** locally.
- **Polished UI & Modals:** Engaging tile animations, clean SCSS-based styling, and custom blurred-background modal overlays (for Win, Game Over, and Resume events) instead of generic browser alerts.

## 🛠 Technologies Used

- **HTML5:** Semantic structure.
- **SCSS / CSS3:** BEM-like methodology for clean styling and responsive layout.
- **Vanilla JavaScript:** All game logic, state management, array manipulations, and DOM updates implemented without external libraries.

## 🚀 How to Play

1. **Start the Game:** Click the "Start" button.
2. **Move Tiles:** Use your keyboard (`Arrow Keys` or `WASD`) or **swipe** on your mobile device to slide the tiles.
3. **Merge Tiles:** When two tiles with the same number touch, they merge into one!
4. **Win Condition:** Create a tile with the number `2048` to win the game. (You can keep playing to increase your score!)

---
*Created by [Rostyslav Sobchyshyn]*
