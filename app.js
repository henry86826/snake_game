const canvas = document.getElementById("myCanvas");
//CanvasRenderingContext2D
const ctx = canvas.getContext("2d");
//getContext() method return一個canvas的drawing context
//drawing context可用來在canvas內畫圖

//貪食蛇以格子為單位當作身體
//每格20
const unit = 20;
//分割canvas
const row = canvas.height / unit; //320/20
const column = canvas.width / unit; //320/20

//設定蛇
let snake = []; //array中每個元素都是obj
//物件的工作是儲存身體的x, y的座標
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

//果實
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickNewLocation() {
    let overLapping = false;
    let new_x;
    let new_y;

    //檢查新地點是否重疊到蛇的任一塊身體
    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        //重疊的話
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overLapping = true;
          return;
        } else {
          overLapping = false;
          return;
        }
      }
    }

    //只要overlappimg是true，就要再執行do
    //do while無論如何都會執行一次do
    //overLapping = true checkOverlap會暫停
    //while (overLapping) 會讓迴圈重複到overLapping不等於true
    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overLapping);

    this.x = new_x;
    this.y = new_y;
  }
}

//初始設定
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
//d = direction
let d = "Right";
//更改蛇的方向

function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  }

  //因為在上面邏輯上，我們可以在兩次draw之間有多次的keydown，會讓蛇可以不碰到頭就結束
  //所以我們要先removeEventListener()，並在draw function裡再加回來
  window.removeEventListener("keydown", changeDirection);
}
let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "目前遊戲分數：" + score;
document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
//draw出遊戲畫面
//用pop() unshift()控制蛇的方向及增加長度
function draw() {
  //每次畫圖之前，確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }
  //背景全設定為黑色，用來刷新畫面
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    //設定要填滿的顏色
    if (i == 0) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "lightblue";
    }

    //讓蛇可以超出邊框
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    //x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //畫長方形
    //外框
    //先設定顏色再畫出來
    ctx.strokeStyle = "white";
    //x, y, width, height
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //依照前面loop結果，放到應該的地方(更新蛇的位置)
  //以目前d變數方向，決定snake array的下一幀要放在哪個座標
  let snakeX = snake[0].x; //snake[0]是一個物件，但snake[0].x是number(不是reference data type)
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    //重新選定新的隨機位置
    //畫新果實
    // myFruit.drawFruit(); 可不用寫，draw裡也會執行
    myFruit.pickNewLocation();
    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "目前遊戲分數：" + score;
    document.getElementById("myScore2").innerHTML = "最高分數：" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
