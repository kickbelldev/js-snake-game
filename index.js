const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

class Snake {
  snake = [{}]
  
  constructor(x, y) {
    this.snake[0].x = x
    this.snake[0].y = y
  }

  draw = () => { // 머리부분을 그리는 메소드
    ctx.fillStyle = '#fff'

    const headX = this.snake[0].x * 25
    const headY = this.snake[0].y * 25
    ctx.fillRect(headX, headY, 25, 25)
  }

  clear = () => { // 꼬리부분을 지우는 메소드
    const tailX = this.snake[this.snake.length - 1].x * 25
    const tailY = this.snake[this.snake.length - 1].y * 25
    ctx.clearRect(tailX, tailY, 25, 25)
  }

  move = () => { // 뱀이 움직이는 메소드
    const dx = [0, 1, 0, -1]
    const dy = [-1, 0, 1, 0]
    const head = {
      x: this.snake[0].x + dx[direction],
      y: this.snake[0].y + dy[direction]
    }

    this.snake.unshift(head)
    this.snake.pop()
  }

  grow = () => { // 뱀이 길어지는 메소드
    const dx = [0, 1, 0, -1]
    const dy = [-1, 0, 1, 0]
    const head = {
      x: this.snake[0].x + dx[direction],
      y: this.snake[0].y + dy[direction]
    }
    this.snake.unshift(head)
  }

  isCollapsed = () => { // 뱀 몸체와 머리가 충돌했는지 확인
    for (let i = 1; i < this.snake.length; i++) {
      if (this.snake[i]?.x === this.snake[0].x && this.snake[i]?.y === this.snake[0].y) {
        console.log('?')
        return true
      }
    }
    return false
  }

  isOut = () => { // 보드를 벗어났는지 확인
    const leftWall = this.snake[0].x < 0
    const rightWall = this.snake[0].x >= 20
    const topWall = this.snake[0].y < 0
    const bottomWall = this.snake[0].y >= 20

    return leftWall || rightWall || topWall || bottomWall
  }

  isBite = (x, y) => { // 사과 먹었는지 확인
    return this.snake[0].x === x && this.snake[0].y === y
  }

  newApple = () => { // apple을 만드는데 왜 snake 클래스의 메소드로 넣었는진 모르겠습니다...
    while (true) {
      const appleX = random()
      const appleY = random()
      let flag = false

      this.snake.forEach((item) => {
        if (item.x === appleX && item.y === appleY) {
          flag = true
        }
      })

      if (flag === false) {
        return [appleX, appleY]
      }
    }
  }
}

class Apple {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  makeApple = () => { // 사과 만들기
    [this.x, this.y] = snake.newApple()
  }

  draw = () => { // 사과 그리기
    ctx.fillStyle = '#f00'

    const x = this.x * 25
    const y = this.y * 25
    ctx.fillRect(x, y, 25, 25)
  }
}

let direction = 0
let score = 0
let isStart = false
let interval
let snake
let apple
// 이 코드들의 위치가 여기가 맞나 싶네요?..

function random () { // 랜덤 좌표값
  return Math.floor(Math.random() * 20)
}

function initialize () { // 말 그대로 객체 초기화
  while (true) {
    const snakeX = random()
    const snakeY = random()
    const appleX = random()
    const appleY = random()
    if (snakeX !== appleX && snakeY !== appleY) {
      snake = new Snake(snakeX, snakeY)
      apple = new Apple(appleX, appleY)
      return
    }
  }
}

function checkgameover () { // 게임 오버 체크 함수
  if (snake.isCollapsed() || snake.isOut()) {
    window.alert(`${score} 점을 획득했습니다.`)
    clearInterval(interval)
  }
}

function process () { // 게임 진행
  isStart = true
  interval = setInterval(() => {
    if (snake.isBite(apple.x, apple.y)) {
      score++
      
      snake.grow()

      checkgameover()

      snake.draw()

      apple.makeApple()
      apple.draw()
    } else {
      snake.clear()
      snake.move()
      checkgameover()
      snake.draw()
    }
  }, 200)
}

function clearGame () {
  ctx.clearRect(0, 0, 500, 500)
  score = 0
  isStart = false
  clearInterval(interval)
}

function load () {
  initialize()
  snake.draw()
  apple.draw()
}

function start () { // 게임 시작
  if (isStart) {
    clearGame()
    initialize()
    snake.draw()
    apple.draw()
  }
  window.onkeydown = ( event ) => {
    switch (event.keyCode) {
      case 38:
        if (direction !== 2) direction = 0
        break
      case 39:
        if (direction !== 3) direction = 1
        break
      case 40:
        if (direction !== 0) direction = 2
        break
      case 37:
        if (direction !== 1) direction = 3
        break
    }
  }
  process()
}
