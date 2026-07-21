'use strict';

let board;
let score = 0;
let bestScore = localStorage.getItem('2048-best-score') || 0;
const rows = 4;
const columns = 4;
const startMessage = document.querySelector('.message-start');
const winMessage = document.getElementById('win-modal');
const loseMessage = document.getElementById('lose-modal');
const button = document.querySelector('.button');
let hasWon = false;
let previousBoard = null;
let previousScore = 0;
let undoCooldown = 0;
const UNDO_MAX_COOLDOWN = 15;

if (loseMessage) {
  document.getElementById('lose-restart').addEventListener('click', () => {
    loseMessage.classList.add('hidden');

    if (gameStarted) {
      button.click();
    }
    button.click();
  });
}

if (winMessage) {
  document.getElementById('win-continue').addEventListener('click', () => {
    winMessage.classList.add('hidden');
  });

  document.getElementById('win-restart').addEventListener('click', () => {
    winMessage.classList.add('hidden');
    hasWon = false;

    if (gameStarted) {
      button.click();
    };
    button.click();
  });
}

let gameStarted = false;
const LEFT = 'ArrowLeft';
const RIGHT = 'ArrowRight';
const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const W = 'KeyW';
const A = 'KeyA';
const S = 'KeyS';
const D = 'KeyD';

window.onload = function() {
  document.querySelector('.game-best-score').innerHTML = bestScore;

  const savedBoard = localStorage.getItem('2048-board');
  const savedScore = localStorage.getItem('2048-score');

  const savedPrevBoard = localStorage.getItem('2048-prev-board');
  const savedPrevScore = localStorage.getItem('2048-prev-score');
  const savedUndoCooldown = localStorage.getItem('2048-undo-cooldown');

  if (savedPrevBoard) {
    try {
      previousBoard = JSON.parse(savedPrevBoard);
      previousScore = parseInt(savedPrevScore, 10);
      undoCooldown = parseInt(savedUndoCooldown, 10);
    } catch (e) {}
  }
  updateUndoBtn();

  if (savedBoard && savedScore) {
    const modal = document.getElementById('resume-modal');
    const btnYes = document.getElementById('resume-yes');
    const btnNo = document.getElementById('resume-no');

    modal.classList.remove('hidden');

    btnYes.onclick = () => {
      modal.classList.add('hidden');

      try {
        board = JSON.parse(savedBoard);
        score = parseInt(savedScore, 10);
        hasWon = localStorage.getItem('2048-has-won') === 'true';
        document.querySelector('.game-score').innerHTML = score;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < columns; c++) {
            const tile = document.createElement('div');

            tile.classList.add('field-cell');
            tile.id = r.toString() + '-' + c.toString();

            const num = board[r][c];

            updateTile(tile, num);
            document.querySelector('.game-field').append(tile);
          }
        }

        button.classList.remove('start');
        button.classList.add('restart');
        button.innerHTML = 'Restart';
        startMessage.classList.add('hidden');
        gameStarted = true;
      } catch (e) {
        setGame();
      }
    };

    btnNo.onclick = () => {
      modal.classList.add('hidden');
      localStorage.removeItem('2048-board');
      localStorage.removeItem('2048-score');
      setGame();
      button.click();
    };
  } else {
    localStorage.removeItem('2048-board');
    localStorage.removeItem('2048-score');
    setGame();
  }
};

function setGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.classList.add('field-cell');
      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.querySelector('.game-field').append(tile);
    }
  }

  gameStarted = false;
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = '';
  tile.classList.add('field-cell');

  if (num > 0) {
    tile.innerText = num;
    tile.classList.add(`field-cell--${num}`);
  }
}

document.addEventListener('keyup', e => {
  if (!gameStarted) {
    return;
  }

  const tempBoard = JSON.parse(JSON.stringify(board));
  const tempScore = score;
  let moveAttempted = false;

  switch (e.code) {
    case LEFT:
    case A:
      slideLeft();
      moveAttempted = true;
      break;

    case RIGHT:
    case D:
      slideRight();
      moveAttempted = true;
      break;

    case UP:
    case W:
      slideUp();
      moveAttempted = true;
      break;

    case DOWN:
    case S:
      slideDown();
      moveAttempted = true;
      break;
  }

  if (moveAttempted && JSON.stringify(tempBoard) !== JSON.stringify(board)) {
    previousBoard = tempBoard;
    previousScore = tempScore;

    if (undoCooldown > 0) {
      undoCooldown--;
    }
    updateUndoBtn();
  }

  updateScores();

  if (isGameOver()) {
    loseMessage.classList.remove('hidden');
  }

  if (!hasWon && isWinner()) {
    winMessage.classList.remove('hidden');
    hasWon = true;
  }

  saveGameState();
});

function updateScores() {
  document.querySelector('.game-score').innerHTML = score;

  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem('2048-best-score', bestScore);
    document.querySelector('.game-best-score').innerHTML = bestScore;
  }
}

function saveGameState() {
  if (!gameStarted) {
    return;
  }

  try {
    localStorage.setItem('2048-board', JSON.stringify(board));
    localStorage.setItem('2048-score', score);
    localStorage.setItem('2048-has-won', hasWon);

    if (previousBoard) {
      localStorage.setItem('2048-prev-board', JSON.stringify(previousBoard));
      localStorage.setItem('2048-prev-score', previousScore);
      localStorage.setItem('2048-undo-cooldown', undoCooldown);
    }
  } catch (e) {
    // Ignore error if localStorage is not available
  }
}

function updateUndoBtn() {
  const btn = document.getElementById('undo-btn');
  const undoIcon = document.querySelector('.undo-icon');
  const undoCooldownText = document.querySelector('.undo-cooldown');
  const undoBar = document.querySelector('.undo-bar');

  if (!previousBoard) {
    btn.disabled = true;
    undoIcon.classList.remove('hidden');
    undoCooldownText.classList.add('hidden');
    undoBar.style.width = '0%';

    return;
  }

  if (undoCooldown > 0) {
    btn.disabled = true;
    undoIcon.classList.add('hidden');
    undoCooldownText.classList.remove('hidden');
    undoCooldownText.innerHTML = undoCooldown;

    const fillPercentage = ((UNDO_MAX_COOLDOWN - undoCooldown)
      / UNDO_MAX_COOLDOWN) * 100;

    undoBar.style.width = fillPercentage + '%';
  } else {
    btn.disabled = false;
    undoIcon.classList.remove('hidden');
    undoCooldownText.classList.add('hidden');
    undoBar.style.width = '100%';
  }
}

// for mobile-devices
let startX, startY, endX, endY;

document.addEventListener('touchstart', e => {
  if (!gameStarted) {
    return;
  }

  startX = e.touches[0].pageX;
  startY = e.touches[0].pageY;
});

document.addEventListener('touchend', e => {
  if (!gameStarted) {
    return;
  }

  endX = e.changedTouches[0].pageX;
  endY = e.changedTouches[0].pageY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const minSwipeDistance = 20;

  const tempBoard = JSON.parse(JSON.stringify(board));
  const tempScore = score;
  let moveAttempted = false;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        slideRight();
        moveAttempted = true;
      } else {
        slideLeft();
        moveAttempted = true;
      }
    }
  } else {
    if (Math.abs(deltaY) > minSwipeDistance) {
      if (deltaY > 0) {
        slideDown();
        moveAttempted = true;
      } else {
        slideUp();
        moveAttempted = true;
      }
    }
  }

  if (moveAttempted && JSON.stringify(tempBoard) !== JSON.stringify(board)) {
    previousBoard = tempBoard;
    previousScore = tempScore;

    if (undoCooldown > 0) {
      undoCooldown--;
    }
    updateUndoBtn();
  }

  updateScores();

  if (isGameOver()) {
    loseMessage.classList.remove('hidden');
  }

  if (!hasWon && isWinner()) {
    winMessage.classList.remove('hidden');
    hasWon = true;
  }

  saveGameState();
});

const undoBtn = document.getElementById('undo-btn');

if (undoBtn) {
  undoBtn.addEventListener('click', () => {
    if (!gameStarted || !previousBoard || undoCooldown > 0) {
      return;
    }

    board = JSON.parse(JSON.stringify(previousBoard));
    score = previousScore;
    undoCooldown = UNDO_MAX_COOLDOWN;

    // re-render board
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());

        updateTile(tile, board[r][c]);
      }
    }

    updateScores();
    updateUndoBtn();
    saveGameState();
  });
}

button.addEventListener('click', () => {
  if (gameStarted) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerHTML = 'Start';
    gameStarted = false;
    resetGame();
    localStorage.removeItem('2048-board');
    localStorage.removeItem('2048-score');
    localStorage.removeItem('2048-has-won');
    localStorage.removeItem('2048-prev-board');
    localStorage.removeItem('2048-prev-score');
    localStorage.removeItem('2048-undo-cooldown');
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
    startMessage.classList.add('hidden');
    gameStarted = true;
    setNum();
    setNum();
    saveGameState();
  }
});

function resetGame() {
  score = 0;
  updateScores();

  if (winMessage) {
    winMessage.classList.add('hidden');
  };

  if (loseMessage) {
    loseMessage.classList.add('hidden');
  };

  startMessage.classList.remove('hidden');
  hasWon = false;
  previousBoard = null;
  previousScore = 0;
  undoCooldown = 0;
  updateUndoBtn();

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      updateTile(tile, 0);
    }
  }
}

function filterZeros(row) {
  return row.filter(num => num !== 0);
}

function slide(row) {
  let newRow = filterZeros(row);

  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];
    }
  }

  newRow = filterZeros(newRow);

  while (newRow.length < columns) {
    newRow.push(0);
  }

  return newRow;
}

function slideLeft() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row = slide(row);
    board[r] = row;

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
};

function slideRight() {
  let moved = false;

  for (let r = 0; r < rows; r++) {
    let row = board[r];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
};

function slideUp() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row = slide(row);

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
}

function slideDown() {
  let moved = false;

  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    const originalRow = [...row];

    row.reverse();
    row = slide(row);
    row.reverse();

    if (!arraysEqual(originalRow, row)) {
      moved = true;
    }

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }

  if (moved) {
    setNum();
  }
}

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function setNum() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = Math.random() < 0.9 ? 2 : 4;

      board[r][c] = num;
      tile.innerText = num;
      tile.classList.add(`field-cell--${num}`);
      tile.classList.add('new-tile');
      setTimeout(() => tile.classList.remove('new-tile'), 200);
      found = true;
    }
  }
}

function isGameOver() {
  const fullBoard = !hasEmptyTile();
  let move = true;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (c > 0 && board[r][c] === board[r][c - 1]) {
        move = false;
      } else if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
        move = false;
      } else if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
        move = false;
      } else if (r > 0 && board[r][c] === board[r - 1][c]) {
        move = false;
      }
    }
  }

  return move && fullBoard;
}

function isWinner() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

// PWA Install Button Logic
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async() => {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      // Ignored console log for linter compliance
    }
    deferredPrompt = null;
    installBtn.style.display = 'none';
  }
});

window.addEventListener('appinstalled', () => {
  installBtn.style.display = 'none';
  deferredPrompt = null;
});
