function Arkanoid(selector, rowBricks) {
  this.selector = selector;
  this.rowBricks = rowBricks;
  this.initCanvas();
  this.initVals();

  setInterval(this.loadGame(), 10);
}

Arkanoid.prototype.initCanvas = () => ({
  canvas: document.createElement("canvas"),
  canvasProps(selector) {
    this.canvas.width = 500;
    this.canvas.height = 450;
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

Arkanoid.prototype.initVals = function () {
  //init & get canvas props
  this.height = 15;
  this.canvas = this.initCanvas().canvasProps(this.selector);
  this.canvasWidth = this.canvas.getBoundingClientRect().width;
  this.canvasHeight = this.canvas.getBoundingClientRect().height;
  this.context = this.canvas.getContext("2d");

  //paddle props
  this.paddleWidth = 100;
  this.paddleX = (this.canvasWidth - this.paddleWidth) / 2;

  //ball props
  this.ballDiameter = 10;
  this.ballX = this.canvasWidth / 2;
  this.ballY = this.canvasHeight - (this.height + this.ballDiameter);
};

Arkanoid.prototype.generateAndDrawPaddle = function () {
  this.context.beginPath();
  this.context.rect(
    this.paddleX,
    this.canvasHeight - this.height,
    this.paddleWidth,
    this.height
  );
  this.context.fillStyle = this.generateRandomColor();
  this.context.fill();
  this.context.closePath();
};

Arkanoid.prototype.generateAndDrawRandomBricksRow = function () {
  this.rowsQty = this.generateRandomNumbers(5, 11) || this.rowBricks.rows;
  this.bricksRow = new Array(this.rowsQty);

  for (let row = 0; row < this.bricksRow.length; row++) {
    this.bricksRow[row] = new Array(this.bricksQty);
    this.bricksQty = this.generateRandomNumbers(3, 7) || this.rowBricks.bricks;
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
  return this.bricksRow;
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

  // ballX += dx;
  // ballY += dy;
};

Arkanoid.prototype.loadGame = function () {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.generateAndDrawPaddle();
  this.drawBall();
  this.generateAndDrawRandomBricksRow();
  this.dx = 2;
  this.dy = -2;

  this.ballX += this.dx;
  this.ballY += this.dy;
};

// console.log(this.generateAndDrawBall());

Arkanoid.prototype.getMainContainerAndAddEventListener = function (
  actionType,
  action
) {
  return document
    .querySelector(this.selector)
    .addEventListener(actionType, action);
};

// console.log(this.getMainContainerAndAddEventListener("keydown", keyDown));
// this.getMainContainerAndAddEventListener("keyup", keyUp);
