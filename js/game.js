'use strict'

const CELL = ' '
const MINE = '💣'
var curMineCount = 0
var gFirstClick = true
var gLives = 3
//WIP dont forget to use these 3 counters once you finish setting everything up

const gGame = {
    isOn: false,
    coveredCount: 0,
    markedCount: 0,
    secsPassed: 0,
    timerInterval: null

}

const gEasyLevel = {
    SIZE: 4,
    MINES: 2
}
const gMedLevel = {
    SIZE: 8,
    MINES: 14
}
const gHardLevel = {
    SIZE: 12,
    MINES: 32
}
const gCustLevel = {
    SIZE: 0,
    MINES: 0
}

var gBoard

function InitEasyDif() {
    document.getElementById("restartButton").textContent = "🙂"
    gLives = 3
    gFirstClick = true
    gGame.secsPassed = 0
    gBoard = easyDif()
    gGame.markedCount = 0
    updateRemainingMines(gEasyLevel.MINES)
    renderBoard(gBoard, '.frame')
    coverCells()
    gGame.isOn = true
    updateLives()

}

function InitMedDif() {
    document.getElementById("restartButton").textContent = "🙂"
    gLives = 3
    gFirstClick = true
    gGame.secsPassed = 0
    gBoard = medDif()
    gGame.markedCount = 0
    updateRemainingMines(gMedLevel.MINES)
    renderBoard(gBoard, '.frame')
    coverCells()
    gGame.isOn = true
    updateLives()
}

function InitHardDif() {
    document.getElementById("restartButton").textContent = "🙂"
    gLives = 3
    gFirstClick = true
    gGame.secsPassed = 0
    gBoard = hardDif()
    gGame.markedCount = 0
    updateRemainingMines(gHardLevel.MINES)
    renderBoard(gBoard, '.frame')
    coverCells()
    gGame.isOn = true
    updateLives()
}

//make a board for easy difficulty
function easyDif() {
    const size = gEasyLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = CELL
        }
    }
    renderBoard(board, '.frame')
    coverCells()
    console.log(board)
    return board

}
//make a board for medium difficulty(get the game working properly first)
function medDif() {
    const size = gMedLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = CELL
        }
    }
    renderBoard(board, '.frame')
    coverCells()
    console.log(board)
    return board

}

//make a board for hard difficulty
function hardDif() {
    const size = gHardLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = CELL
        }
    }
    renderBoard(board, '.frame')
    coverCells()
    console.log(board)
    return board
}

//make a board for custom difficulty

function InitCustomDif() {
    document.getElementById("restartButton").textContent = "🙂"
    gLives = 3
    gFirstClick = true
    gGame.secsPassed = 0
    const sizeInput = document.getElementById("custSize").value
    const minesInput = document.getElementById("custMines").value

    if (!sizeInput || !minesInput || sizeInput < 2 || minesInput < 1 || minesInput >= sizeInput * sizeInput) {
        alert("Please enter valid grid size and number of mines!")
        return
    }
    gCustLevel.SIZE = parseInt(sizeInput)
    gCustLevel.MINES = parseInt(minesInput)

    gBoard = customDif()
    gGame.markedCount = 0
    updateRemainingMines(minesInput)
    renderBoard(gBoard, '.frame')
    coverCells()
    gGame.isOn = true
    updateLives()
}

function customDif() {
    const size = gCustLevel.SIZE
    const board = []

    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = CELL
        }
    }
    renderBoard(board, '.frame')
    coverCells()
    console.log(board)
    return board
}

//make a mine spawner with a counter 

function spawnMines(board, MCount, firstClickI, firstClickJ) {
    while (MCount > 0) {
        var emptyLocation
        do {
            var i = getRandomIntInclusive(0, board.length - 1)
            var j = getRandomIntInclusive(0, board[0].length - 1)

            emptyLocation = { i: i, j: j }
        } while (
            (board[emptyLocation.i][emptyLocation.j] !== CELL) || (emptyLocation.i === firstClickI && emptyLocation.j === firstClickJ))

        board[emptyLocation.i][emptyLocation.j] = MINE
        MCount--
    }
}

//make something to cover the cells and uncover on click

function coverCells() {
    const allCells = document.querySelectorAll('.cell')
    allCells.forEach(cell => {
        cell.classList.add('CCELL')
        cell.innerHTML = ''
    })
}

function cellClicked(i, j) {
    if (!gGame.isOn) return

    if (gFirstClick) {
        gFirstClick = false


        if (!gGame.timerInterval) {
            timerStart()
        }

        var mineCount = 0
        if (gBoard.length === gEasyLevel.SIZE) {
            mineCount = gEasyLevel.MINES
        } else if (gBoard.length === gMedLevel.SIZE) {
            mineCount = gMedLevel.MINES
        } else if (gBoard.length === gHardLevel.SIZE) {
            mineCount = gHardLevel.MINES
        } else if (gBoard.length === gCustLevel.SIZE) {
            mineCount = gCustLevel.MINES
        }
        spawnMines(gBoard, mineCount, i, j)
    }
    const cell = gBoard[i][j]
    const elCell = document.querySelector(`.cell-${i}-${j}`)

    if (elCell.classList.contains('UCELL')) {
        return
    }
    if (cell === MINE) {
        if (gLives > 0) {
            gLives--
            updateLives()

            elCell.classList.add("flagged")
            elCell.innerHTML = "🚩"
            alert("MINE CLICKED!")
            if (gLives === 0) {
                gameOver(false)
            }
        } else {
            elCell.classList.remove('CCELL')
            elCell.classList.add('UCELL')
        }
    }
    else {
        elCell.classList.remove('CCELL')
        elCell.classList.add('UCELL')

        const adjMines = countAdjMines(i, j)

        if (adjMines > 0) {
            elCell.innerHTML = adjMines
        }
        else {
            elCell.innerHTML = ''
            uncoverAdjCells(i, j)
        }
    }
}

//make the right click place flags on covered cells

document.querySelector(".frame").addEventListener("contextmenu", function (event) {
    if (event.target.classList.contains("cell")) {
        event.preventDefault()
        placeFlag(event.target)
    }
})

function placeFlag(elCell) {
    if (elCell.classList.contains("UCELL")) return

    if (elCell.classList.contains("flagged")) {
        elCell.classList.remove("flagged")
        elCell.innerHTML = "";
        gGame.markedCount--
    } else {
        elCell.classList.add("flagged")
        elCell.innerHTML = "🚩"
        gGame.markedCount++
    }
    var minesCount = 0
    if (gGame.isOn) {
        if (gBoard.length === gEasyLevel.SIZE) {
            minesCount = gEasyLevel.MINES
        } else if (gBoard.length === gMedLevel.SIZE) {
            minesCount = gMedLevel.MINES
        } else if (gBoard.length === gHardLevel.SIZE) {
            minesCount = gHardLevel.MINES
        } else {
            minesCount = gCustLevel.MINES
        }
    }
    updateRemainingMines(minesCount)
}


function updateRemainingMines(minesCount) {
    const remainingMines = minesCount - gGame.markedCount
    document.getElementById("remainingMines").textContent = remainingMines
}


//WIP,DONT FORGET TO CHANGE THIS LATER!!! make a simple game-over for now and change this to properly show up later

function gameOver(Win) {
    clearInterval(gGame.timerInterval)
    gGame.timerInterval = null

    if (Win) {
        console.log('you won')
        document.getElementById("restartButton").textContent = "😎"
    }
    else {
        console.log('whoops')
        document.getElementById("restartButton").textContent = "☠️"
    }
    gGame.isOn = false
    revealGrid()
}

function revealGrid() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            const elCell = document.querySelector(`.cell-${i}-${j}`)

            elCell.classList.remove('CCELL')
            elCell.classList.add('UCELL')

            if (gBoard[i][j] === MINE) {
                elCell.innerHTML = MINE
            } else {
                const adjMines = countAdjMines(i, j)
                if (adjMines > 0) {
                    elCell.innerHTML = adjMines
                } else {
                    elCell.innerHTML = ''
                }
            }
        }
    }
}

//find a way to count the mines around each cell and display it 

function countAdjMines(i, j) {
    const aroundCell = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]

    var mineCount = 0

    aroundCell.forEach(([diri, dirj]) => {
        const newi = i + diri
        const newj = j + dirj

        if (newi >= 0 && newi < gBoard.length && newj >= 0 && newj < gBoard[0].length) {
            if (gBoard[newi][newj] === MINE) {
                mineCount++
            }
        }
    })
    return mineCount
}


//find a way to make a loop to uncover any cell that doesnt have any adjacent mines to it 

function uncoverAdjCells(i, j) {
    const aroundCell = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ]

    aroundCell.forEach(([diri, dirj]) => {
        const newi = i + diri
        const newj = j + dirj

        if (newi >= 0 && newi < gBoard.length && newj >= 0 && newj < gBoard[0].length) {
            const elCell = document.querySelector(`.cell-${newi}-${newj}`)
            if (!elCell.classList.contains('UCELL')) {
                cellClicked(newi, newj)
            }
        }
    })
}

//make the timer function

function timerStart() {
    const elTimer = document.getElementById("timer")
    gGame.secsPassed = 0

    gGame.timerInterval = setInterval(() => {
        gGame.secsPassed++
        elTimer.textContent = `${gGame.secsPassed} seconds`
    }, 1000)
}

//update the lives on display
function updateLives() {
    document.getElementById("liveCount").textContent = ` Lives left: ${gLives}`
}

function getRandomInt(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min)
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}