"use strict";
const LIVE = "❤️";
var gBoard;
var elSmiley;
var elLives;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  gameIsOver: false,
  lives: 3,
};

function initGame(level, mines) {
  gBoard = [];
  elSmiley = document.querySelector(".reset");
  elSmiley.innerText = "🙂";
  gGame.shownCount = 0;
  gGame.markedCount = 0;
  gGame.secsPassed = 0;
  gGame.lives = 3;
  elLives = document.querySelector(".lives");
  setLivesHTML();
  gGame.isOn = false;
  gGame.gameIsOver = false;
  gLevel.MINES = mines;
  gLevel.SIZE = level;
  gBoard = buildBoard();
  renderBoard(gBoard);
}

function buildBoard() {
  const board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    var newLine = [];
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
      newLine.push(cell);
    }
    board.push(newLine);
  }
  gBoard = board;
  renderBoard(board);
  return board;
}

function renderBoard(board) {
  console.log("Befote render ", board);
  const elBoard = document.querySelector(".board");
  var strHTML = "<table>";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      var currCell =gBoard[i][j]
       var cellImg = renderImg(i,j);
     
      strHTML += `<td><div data-i=${i} data-j=${j} oncontextmenu="cellMarked(${i}, ${j},event)" onclick="onCellClicked(this)" >${cellImg}</div></td>`;
    }
    strHTML += "</tr>";
  }
  strHTML += "</table>";
  elBoard.innerHTML = strHTML;
}

function randMinesPos(posI,posJ) {
  var count = 0;
  while (count < gLevel.MINES) {
    var i = getRandomInt(0, gLevel.SIZE - 1)
    var j = getRandomInt(0, gLevel.SIZE - 1)
if(i!=posI&&j!=posJ){
    if (gBoard[i][j].isMine === false) {
        gBoard[i][j].isMine = true
        count++
    }
}
}

}

function randCell(i, j) {
  if (!gBoard[i][j].isShown) {
    gBoard[i][j].isShown = true;
  }
}

function setMinesNegsCount(board) {
    console.log(board);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            var rowIdx = i
            var colIdx = j
            var minesCount = 0
            for (var x = rowIdx - 1; x <= rowIdx + 1; x++) {
                if (x < 0 || x >= board.length) continue
                for (var y = colIdx - 1; y <= colIdx + 1; y++) {
                    if (x === rowIdx && y === colIdx) continue
                    if (y < 0 || y >= board[i].length) continue
                    if (gBoard[x][y].isMine === true) minesCount++
                }
            }
            board[i][j].minesAroundCount = minesCount
        }
    }
    console.log('after count', board);
}

function onCellClicked(elCell) {
  if (gGame.gameIsOver === true) return;
  var i = elCell.dataset.i;
  var j = elCell.dataset.j;
  if (gBoard[i][j].isShown === true) return;
  if (gBoard[i][j].isMarked === true) return;
 
  if (!gGame.isOn) {
    gGame.isOn = true;

    randMinesPos(i,j);
    openCell(i, j);
    setMinesNegsCount(gBoard);
  }

  gBoard[i][j].isShown = true;

  if (gBoard[i][j].isMine===false) {
      expandShown(i, j);
    } else {
        gGame.lives--;
        setLivesHTML();
    checkGameOver();
  }
  gGame.shownCount++;

  renderBoard(gBoard);
}

function openCell(cellI, cellJ) {
  for (var i = cellI - 1; i <= cellJ + 1; i++) {
    if (i < 0 || i >= gBoard.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gBoard[0].length) continue;
      var currCell = gBoard[i][j];
      if(currCell.isMine)return
      currCell.isShown = true;
    }
  }
}

function renderImg(i,j) {
    var cell = gBoard[i][j]
  
    if (gBoard[i][j].isMarked) {
        console.log('makred');
        return `<img class="cellImg" src="./pics/flag.jpg"/>`
    }
    if (!cell.isShown) return `<img class="cellImg" src="./pics/notEmpty.png"/>`
    if (cell.isMine) return `<img class="cellImg" src="./pics/boom.jpg"/>`
    if (cell.minesAroundCount === 0) return `<img class="cellImg" src="./pics/empty.png"/>`
    if (cell.minesAroundCount === 1) return `<img class="cellImg" src="./pics/1.png"/>`
    if (cell.minesAroundCount === 2) return `<img class="cellImg" src="./pics/2.jpg"/>`
    if (cell.minesAroundCount === 3) return `<img class="cellImg" src="./pics/3.jpg"/>`
    if (cell.minesAroundCount === 4) return `<img class="cellImg" src="./pics/4.jpg"/>`
    if (cell.minesAroundCount === 5) return `<img class="cellImg" src="./pics/4.jpg"/>`
    if (cell.minesAroundCount === 6) return `<img class="cellImg" src="./pics/6.jpg"/>`
    if (cell.minesAroundCount === 7) return `<img class="cellImg" src="./pics/7.jpg"/>`

}

function checkGameOver() {
  if (gGame.isShown === true) {
    alert("You Win !!");
    elSmiley.innerText = "😎";
  }
  if (gGame.lives === 0) {
    gGame.gameIsOver = true;
    elSmiley.innerText = "☠️";
  }
}

function expandShown(i, j) {
  var idxI = i;
  var idxJ = j;

  if (gBoard[i][j].minesAroundCount === 0) {
    for (var idxI = i - 1; idxI <= i + 1; idxI++) {
      if (idxI < 0 || idxI >= gBoard.length) continue;
      for (var idxJ = j - 1; idxJ <= j + 1; idxJ++) {
        if (idxJ < 0 || idxJ >= gBoard[0].length) continue;
        if (i === idxI || j === idxJ) continue;
        if (gBoard[i][j].isMine) return;
        gBoard[i][j].isShown = true;
      }
    }
  }
}

function cellMarked(i, j, ev) {
  ev.preventDefault();
  gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
  renderBoard(gBoard);
}

function setLivesHTML() {
  var livesLeft = "";

  for (var i = 0; i < gGame.lives; i++) {
    livesLeft += LIVE;
  }
  elLives.innerText = livesLeft;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
