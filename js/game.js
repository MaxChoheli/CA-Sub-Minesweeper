'use strict'

const CELL = ' '
const MINE = '💣'

//WIP dont forget to use these 3 counters once you finish setting everything up

const gGame = {
    isOn: false,
    coveredCount: 0,
    markedCount: 0,
    secsPassed: 0

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
    gBoard = easyDif()


    renderBoard(gBoard, '.frame')
    coverCells()
    gGame.isOn = true
}

function InitMedDif() {
    gBoard = medDif()

    renderBoard(gBoard, '.frame')
    coverCells()
    gGame.isOn = true
}

function InitHardDif() {
    gBoard = hardDif()

    renderBoard(gBoard, '.frame')
    coverCells()
    gGame.isOn = true
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
    spawnMines(board, gEasyLevel.MINES)
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
    spawnMines(board, gMedLevel.MINES)
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
    spawnMines(board, gHardLevel.MINES)
    coverCells()
    console.log(board)
    return board
}

//make a board for custom difficulty
//make a mine spawner with a counter 

function spawnMines(board, MCount) {
    while (MCount > 0) {
        var emptyLocation
        do {
            var i = getRandomIntInclusive(0, board.length - 1)
            var j = getRandomIntInclusive(0, board[0].length - 1)

            emptyLocation = { i: i, j: j }
        } while (board[emptyLocation.i][emptyLocation.j] !== CELL)

        board[emptyLocation.i][emptyLocation.j] = MINE
        renderCell(emptyLocation, MINE)
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
    const cell = gBoard[i][j]
    const elCell = document.querySelector(`.cell-${i}-${j}`)

    if (elCell.classList.contains('UCELL')) {
        return
    }
    elCell.classList.remove('CCELL')
    elCell.classList.add('UCELL')

    if (cell === MINE) {
        elCell.innerHTML = MINE
        gameOver(false)
    }
    else {
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

//WIP,DONT FORGET TO CHANGE THIS LATER!!! make a simple game-over for now and change this to properly show up later

function gameOver(Win) {
    if (Win) {
        console.log('you won')
    }
    else {
        console.log('whoops')
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


function getRandomInt(min, max) {
    return (Math.floor(Math.random() * (max - min)) + min)
}
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}