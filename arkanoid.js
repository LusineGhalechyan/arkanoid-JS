function Arkanoid(selector, rowBricks) {
  this.selector = selector;
  this.rowBricks = rowBricks;

  //space key options
  this.spaceKey = " ";
  this.spaceKeyPressed = false;

  //get canvas props
  this.canvas = this.initCanvas().canvasProps(this.selector);
  this.canvasWidth = this.canvas.getBoundingClientRect().width;
  this.canvasHeight = this.canvas.getBoundingClientRect().height;
  this.context = this.canvas.getContext("2d");

  //init bricks
  this.height = 15;
  this.bricksRow = [];

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
  this.dx = 1;
  this.dy = -1;
  this.ballDiameter = 10;
  this.ballX = this.canvasWidth / 2;
  this.ballY = this.canvasHeight - (this.height + this.ballDiameter);

  this.initCanvas();
  this.loadGame();
  this.addMultipleListeners();
  console.log(`spaceKeyPressed_CLASS`, this.spaceKeyPressed);
  // this.destroyEventListeners();

  // this.generateAndDrawPaddle();
  // this.generateAndDrawRandomBricksRow();
}

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
  var eventsArray = [
    {
      actionType: "keydown",
      action: (evt) => this.keyDown(evt),
    },
    {
      actionType: "keyup",
      action: (evt) => this.keyUp(evt),
    },
  ];

  eventsArray.forEach((evtObj) => {
    this.canvas.addEventListener(evtObj["actionType"], evtObj["action"]);
  });
};

Arkanoid.prototype.destroyEventListeners = function () {
  var eventsArray = [
    // see afterwards !!!!! to make inheritance between class methods

    {
      actionType: "keydown",
      action: (evt) => this.keyDown(evt),
    },
    {
      actionType: "keyup",
      action: (evt) => this.keyUp(evt),
    },
  ];

  eventsArray.forEach((evtObj) => {
    this.canvas.removeEventListener(evtObj["actionType"], evtObj["action"]);
  });
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
  // this.context.globalAlpha = 0.3;
  this.context.arc(
    this.ballX,
    this.ballY,
    this.ballDiameter,
    0,
    Math.PI * this.ballDiameter
  );

  this.context.fillStyle = "#0000ff";
  this.context.fill();
  // this.context.globalAlpha = 1;
  this.context.closePath();
};

Arkanoid.prototype.generateAndDrawRandomBricksRow = function () {
  this.rowsQty = this.rowBricks.rows || this.generateRandomNumbers(5, 11);
  for (let i = 0; i < this.rowsQty; i++) {
    this.bricksRow = Array(this.rowsQty);
  }
  for (let row = 0; row < this.bricksRow.length; row++) {
    this.bricksRow[row] = Array(this.bricksQty);
    this.bricksQty =
      this.generateRandomNumbers(this.rowBricks.bricks, this.rowBricks.rows) ||
      this.generateRandomNumbers(3, 11);
    this.brickWidth = parseInt(this.canvasWidth / this.bricksQty);
    for (let brick = 0; brick < this.bricksQty; brick++) {
      this.bricksRow[row][brick] = { x: 0, y: 0 };
      var brickX = brick * this.brickWidth;
      var brickY = row * this.height;
      this.bricksRow[row][brick].x = brickX;
      this.bricksRow[row][brick].y = brickY;
      this.context.beginPath();
      this.context.rect(brickX, brickY, this.brickWidth, this.height);
      this.context.fillStyle = this.generateRandomColor();
      this.context.fill();
      this.context.closePath();
    }
  }
};

Arkanoid.prototype.loadGame = function () {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.generateAndDrawPaddle();
  this.drawBall();
  // this.generateAndDrawRandomBricksRow();

  this.ballX += this.dx;
  this.ballY += this.dy;

  if (
    this.ballX + this.dx + this.ballDiameter > this.canvasWidth ||
    this.ballX + this.dx - this.ballDiameter < 0
  )
    this.dx = -this.dx;

  if (this.ballY + this.dy - this.ballDiameter < 0) this.dy = -this.dy; // || this.ballY + this.dy + this.ballDiameter > this.canvasHeight

  if (this.ballY + this.dy + this.ballDiameter > this.canvasHeight) {
    alert(`🚫 Game is over !`);
    clearInterval(this.gameInterval);
    document.location.reload(); // SEE AFTERWARDS
    // this.initCanvas().canvas;
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
  console.log(`spaceKeyPressed_DWN`, this.spaceKeyPressed);

  if (evt.key === this.rightArrowKey) this.rightPressed = true;
  if (evt.key === this.leftArrowKey) this.leftPressed = true;
  if (evt.key === this.spaceKey && !this.spaceKeyPressed) {
    this.spaceKeyPressed = true;
    this.gameInterval = setInterval(() => this.loadGame(), 10);
  }
};

Arkanoid.prototype.keyUp = function (evt) {
  console.log(`this.gameInterval`, this.gameInterval);
  if (evt.key === this.rightArrowKey) this.rightPressed = false;
  if (evt.key === this.leftArrowKey) this.leftPressed = false;
};
