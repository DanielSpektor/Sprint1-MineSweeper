'use strict'

var gBoard
var gLevel = { 
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    gameIsOver: false
}


function initGame(level, mines) {
    gGame.isOn=false
    gGame.gameIsOver = false
    gLevel.MINES = mines
    gLevel.SIZE = level
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        var newLine = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cell = {minesAroundCount: 0, isShown: false, isMine: false, isMarked:false }
            newLine.push(cell)
        }         
        board.push(newLine)
    }
    gBoard = board
    renderBoard(board)
    return board
}

function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    // console.log(board);
    var strHTML = '<table>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell= renderImg(i, j)
            strHTML += `<td><div data-i=${i} data-j=${j} oncontextmenu="cellMarked(${i}, ${j},event)" onclick="onCellClicked(this)" >${currCell}</div></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</table>'
    elBoard.innerHTML = strHTML
    // console.log(strHTML)  
}

function randMinesPos() {
    var count = 0
    while (count < gLevel.MINES) {
        var i = getRandomInt(0, gLevel.SIZE-1)
        var j = getRandomInt(0, gLevel.SIZE-1)

        if (gBoard[i][j].isShown === false && gBoard[i][j].isMine === false) {
            gBoard[i][j].isMine = true 
            count++
        }
    }
    renderBoard(gBoard)
}

function randCell(i, j) {
  if(!gBoard[i][j].isShown) {
    gBoard[i][j].isShown = true
  }
}

function setMinesNegsCount(board) {

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
}

function onCellClicked(elCell) {
    if (gGame.gameIsOver === true) return
    var i = elCell.dataset.i
    var j = elCell.dataset.j
    if(gBoard[i][j].isMarked===true)return 
    
    // console.log(elCell.dataset.i);
    if(!gGame.isOn) {
        gGame.isOn = true
        //gBoard[i][j].isShown = true
        openCell(i,j)
        randMinesPos()
        setMinesNegsCount(gBoard)
    }
    if(!gBoard[i][j].isMine) {
        gBoard[i][j].isShown = true
        renderImg(i, j)
    }else{
        gBoard[i][j].isShown = true
        expandShown(i, j)
        renderImg(i, j)
        checkGameOver()
    }
    renderBoard(gBoard)
    
}

function openCell(cellI,cellJ) {
for (var i = cellI - 1; i <= cellJ + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[0].length) continue
            var currCell = gBoard[i][j]
            currCell.isShown=true
        }
    }
}

function renderImg (i, j) {
    var cell = gBoard[i][j]
    console.log('r');
    if(gBoard[i][j].isMarked){
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
    gGame.gameIsOver = true 
    
} 
                        
function expandShown(i, j) { 
    var idxI = i
    var idxJ = j
    
    if (gBoard[i][j].minesAroundCount = 0) {

        for (var idxI = i -1; idxI <= i + 1; idxI++) {
            if(idxI < 0 || idxI >= gBoard.length) continue
            for (var idxJ = j - 1; idxJ <= j + 1; idxJ++) {
                if (idxJ < 0 || idxJ >= gBoard[0].length) continue
                if (i === idxI || j === idxJ) continue
                if (gBoard[i][j].isMine) return
                    gBoard[i][j].isShown = true
            }
        }    
    }
}
    


function cellMarked(i, j,ev) {
    console.log('right click');
ev.preventDefault()
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
console.log(gBoard[i][j]);
    renderBoard(gBoard)

}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}
                            