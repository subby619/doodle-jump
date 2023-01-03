document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerMoveLeft = 50
    let startingPoint = 150
    let doodlerMoveBottom = startingPoint
    let isGameOver = false
    let numberOfPlatforms = 5
    let platforms = []
    let upTimerId
    let downTimerId
    let jumping = true
    let goingLeft = false
    let goingRight = false
    let leftTimerId
    let rightTimerId
    let score = 0

    function makeDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerMoveLeft = platforms[0].left
        doodler.style.left = doodlerMoveLeft + 'px'
        doodler.style.bottom = doodlerMoveBottom + 'px'

    }

    class Platform {
        constructor(newBottomPlat) {
            this.bottom = newBottomPlat
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function makePlatforms() {
        for (let i = 0; i < numberOfPlatforms; i++) {
            let gaps = 600 / numberOfPlatforms
            let newBottomPlat = 100 + i * gaps
            let newPlatform = new Platform(newBottomPlat) 
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function shiftPlatforms() {
        if (doodlerMoveBottom > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score ++
                    console.log(platforms)
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function bounce() {
        clearInterval(downTimerId)
        jumping = true
        upTimerId = setInterval(function () {
            doodlerMoveBottom += 20
            doodler.style.bottom = doodlerMoveBottom + 'px'
            if (doodlerMoveBottom > startingPoint + 200) {
                drop()
            }
        },30)
    }

    function drop() {
        clearInterval(upTimerId)
        jumping = false
        downTimerId = setInterval(function () {
            doodlerMoveBottom -= 5
            doodler.style.bottom = doodlerMoveBottom + 'px'
            if (doodlerMoveBottom <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerMoveBottom >= platform.bottom) &&
                    (doodlerMoveBottom <= platform.bottom + 15) &&
                    ((doodlerMoveLeft + 60) >= platform.left) &&
                    (doodlerMoveLeft <= (platform.left + 85)) &&
                    !jumping
                    
                ) {
                    console.log('landed')
                    startingPoint = doodlerMoveBottom
                    bounce()
                }
            })
        },30)
    }

    function gameOver() {
        console.log('game over!')
        isGameOver = true
        while (grid.firstChild) {
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerId)
        clearInterval(downTimerId)
        clearInterval(leftTimerId)
        clearInterval(rightTimerId)
    }

    function myControl(e) {
        if (e.key === "ArrowLeft") {
            movingLeft()
        } else if (e.key === "ArrowRight") {
            movingRight()
        } else if (e.key === "ArrowUp") {
            movingStraight()
        }
    }

    function movingLeft() {
        if (goingRight) {
            clearInterval(rightTimerId)
            goingRight = false
        }
        goingLeft = true
        leftTimerId = setInterval(function () {
            if (doodlerMoveLeft >= 0) {
                doodlerMoveLeft -= 5
                doodler.style.left = doodlerMoveLeft + 'px'
            } else movingRight()
        },20)
    }

    function movingRight() {
        if (goingLeft) {
            clearInterval(leftTimerId)
            goingLeft = false
        }
        goingRight = true
        rightTimerId = setInterval(function () {
            if (doodlerMoveLeft <= 340) {
                doodlerMoveLeft += 5
                doodler.style.left = doodlerMoveLeft + 'px'
            } else movingLeft()
        ,20})
    }

    function movingStraight() {
        goingRight = false
        goingLeft = false
        clearInterval(rightTimerId)
        clearInterval(leftTimerId)
    }

    function startGame() {
        if (!isGameOver) {
            makePlatforms()
            makeDoodler()
            setInterval(shiftPlatforms,30)
            bounce()
            document.addEventListener('keyup',myControl)
        }
    }
    // attach to a button
    startGame()
})  