function Arkanoid(selector, rowBricks) {
  this.selector = selector;
  this.rowBricks = rowBricks;
  //get canvas props
  this.canvas = this.initCanvas().canvasProps(this.selector);
  this.canvasWidth = this.canvas.getBoundingClientRect().width;
  this.canvasHeight = this.canvas.getBoundingClientRect().height;
  this.context = this.canvas.getContext("2d");

  this.initGame();
}

Arkanoid.prototype.initGame = function () {
  //space key options
  this.spaceKey = " ";
  this.spaceKeyPressed = false;

  // events data
  this.eventsArray = [
    {
      actionType: "keydown",
      action: (evt) => this.keyDown(evt),
    },
    {
      actionType: "keyup",
      action: (evt) => this.keyUp(evt),
    },
    {
      actionType: "reload",
      action: (evt) => this.reLoad(evt),
    },
  ];

  this.isGameOvered = false;
  this.event = new CustomEvent("reload");

  //init and generate bricks
  this.height = 15;
  this.bricksRow = Array();
  this.rowsQty = this.rowBricks.rows || this.generateRandomNumbers(5, 11);

  for (let row = 0; row < this.rowsQty; row++) {
    this.bricksRow[row] = Array();
    this.bricksQty =
      this.generateRandomNumbers(this.rowBricks.bricks, this.rowBricks.rows) ||
      this.generateRandomNumbers(3, 11);
    this.brickWidth = parseInt(this.canvasWidth / this.bricksQty);

    for (let brick = 0; brick < this.bricksQty; brick++) {
      this.bricksRow[row][brick] = {
        x: 0,
        y: 0,
        color: "",
        brickWidth: this.brickWidth,
        status: 1,
      };

      this.brickX = brick * this.bricksRow[row][brick]["brickWidth"];
      this.brickY = row * this.height;
      this.bricksRow[row][brick]["x"] = this.brickX;
      this.bricksRow[row][brick]["y"] = this.brickY;
      this.bricksRow[row][brick]["color"] = this.generateRandomColor();
    }
  }

  //paddle props
  this.paddleWidth = 100;
  this.paddleX = (this.canvasWidth - this.paddleWidth) / 2;
  this.paddleY = this.canvasHeight - this.height;
  this.rightPressed = false;
  this.leftPressed = false;
  this.rightArrowKey = "ArrowRight";
  this.leftArrowKey = "ArrowLeft";
  this.rightArrowVal = 5;
  this.leftArrowVal = 5;

  //ball props
  this.dx = 2;
  this.dy = -2;
  this.ballDiameter = 10;
  this.ballX = this.canvasWidth / 2;
  this.ballY = this.canvasHeight - (this.height + this.ballDiameter);

  //collision counts
  this.collisionCount = 0;

  this.initCanvas();
  this.loadGame();
  this.addMultipleListeners();
};

Arkanoid.prototype.initCanvas = () => ({
  canvas: document.createElement("canvas"),
  canvasProps(selector) {
    this.canvas.width = 500;
    this.canvas.height = 450;
    this.canvas.tabIndex = 1000;
    this.canvas.classList.add(selector || arkanoid.selector);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    return this.canvas;
  },
});

Arkanoid.prototype.reLoad = function (evt) {
  this.initGame();
};

Arkanoid.prototype.generateRandomColor = () => {
  var color = "#";
  var hexaDecimalVal = "0123456789ABCDEF";
  for (let i = 0; i < 6; i++) {
    color += hexaDecimalVal[Math.floor(Math.random() * 16)];
  }
  return color;
};

Arkanoid.prototype.generateRandomNumbers = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

Arkanoid.prototype.addMultipleListeners = function () {
  this.eventsArray.forEach((evtObj) => {
    this.canvas.addEventListener(evtObj["actionType"], evtObj["action"]);
  });
};

Arkanoid.prototype.destroyEventListeners = function () {
  this.eventsArray.forEach((evtObj) => {
    this.canvas.removeEventListener(evtObj["actionType"], evtObj["action"]);
  });
};

Arkanoid.prototype.collisionDetection = function () {
  var brickCount = 0;
  for (let row = 0; row < this.rowsQty; row++) {
    for (let brick = 0; brick < this.bricksRow[row].length; brick++) {
      this.brickObj = this.bricksRow[row][brick];
      brickCount++;
      if (this.brickObj["status"]) {
        if (
          this.ballX > this.brickObj["x"] &&
          this.ballX < this.brickObj["x"] + this.brickObj["brickWidth"] &&
          this.ballY > this.brickObj["y"] &&
          this.ballY < this.brickObj["y"] + this.height
        ) {
          this.dy = -this.dy;
          this.brickObj["status"] = 0;
          this.collisionCount++;
        }
      }
    }
  }
  if (this.collisionCount === brickCount) {
    alert(`You win 🎉🎉🎉`);
    clearInterval(this.gameInterval);
    this.canvas.dispatchEvent(this.event);
    this.destroyEventListeners();
  }
};

Arkanoid.prototype.generateAndDrawPaddle = function () {
  this.context.beginPath();
  this.context.rect(this.paddleX, this.paddleY, this.paddleWidth, this.height);
  this.context.fillStyle = "#B0F63C";
  this.context.fill();
  this.context.closePath();
};

Arkanoid.prototype.drawBall = function () {
  this.context.beginPath();
  this.context.arc(
    this.ballX,
    this.ballY,
    this.ballDiameter,
    0,
    Math.PI * this.ballDiameter
  );
  this.context.fillStyle = "#0000ff";
  this.context.fill();
  this.context.closePath();
};

Arkanoid.prototype.drawBricks = function () {
  for (let row = 0; row < this.rowsQty; row++) {
    for (let brick = 0; brick < this.bricksRow[row].length; brick++) {
      var { x, y, color, brickWidth, status } = this.bricksRow[row][brick];
      if (!status) continue;
      this.context.beginPath();
      this.context.rect(x, y, brickWidth, this.height);
      this.context.fillStyle = color;
      this.context.fill();
      this.context.closePath();
    }
  }
};

Arkanoid.prototype.loadGame = function () {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.drawBricks();
  this.drawBall();
  this.generateAndDrawPaddle();
  this.collisionDetection();

  this.ballX += this.dx;
  this.ballY += this.dy;

  if (
    this.ballX + this.dx + this.ballDiameter > this.canvasWidth ||
    this.ballX + this.dx - this.ballDiameter < 0
  )
    this.dx = -this.dx;

  if (this.ballY + this.dy - this.ballDiameter < 0) {
    this.dy = -this.dy;
  } else if (this.ballY + this.dy + this.ballDiameter > this.canvasHeight) {
    if (
      this.ballX > this.paddleX &&
      this.ballX < this.paddleX + this.paddleWidth
    ) {
      this.dy = -this.dy;
    } else {
      alert(`❗❗❗ Game is over ❗❗❗`);
      clearInterval(this.gameInterval);
      this.canvas.dispatchEvent(this.event);
      this.destroyEventListeners();
    }
  }

  if (this.rightPressed) {
    this.paddleX += this.rightArrowVal;
    if (this.paddleX > this.canvasWidth - this.paddleWidth) {
      this.paddleX = this.canvasWidth - this.paddleWidth;
    }
  }

  if (this.leftPressed) {
    this.paddleX -= this.leftArrowVal;
    if (this.paddleX < 0) {
      this.paddleX = 0;
    }
  }
};

Arkanoid.prototype.keyDown = function (evt) {
  if (evt.key === this.rightArrowKey) this.rightPressed = true;
  if (evt.key === this.leftArrowKey) this.leftPressed = true;
  if (evt.key === this.spaceKey && !this.spaceKeyPressed) {
    this.spaceKeyPressed = true;
    this.gameInterval = setInterval(() => this.loadGame(), 10);
  }
};

Arkanoid.prototype.keyUp = function (evt) {
  if (evt.key === this.rightArrowKey) this.rightPressed = false;
  if (evt.key === this.leftArrowKey) this.leftPressed = false;
};
