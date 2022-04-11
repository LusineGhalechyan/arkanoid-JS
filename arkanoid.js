function Arkanoid(selector, rowBricks) {
  this.selector = selector;
  this.rowBricks = rowBricks;
  this.start();
  this.generateDrawRandomBricksRow();
  this.generateAndDrawPaddle();
  this.generateAndDrawBall();
}

Arkanoid.prototype.start = () => ({
  canvas: document.createElement("canvas"),
  startGame(selector) {
    this.canvas.width = 500;
    this.canvas.height = 500;
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

Arkanoid.prototype.generateDrawRandomBricksRow = function () {
  this.rowsQty = this.generateRandomNumbers(5, 11) || this.rowBricks.rows;
  this.bricksRow = new Array(this.rowsQty);
  this.canvas = this.start().startGame(this.selector);
  this.canvasWidth = this.canvas.getBoundingClientRect().width;
  this.canvasHeight = this.canvas.getBoundingClientRect().height;
  this.context = this.canvas.getContext("2d");
  this.height = 15;

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
  console.log(`this.bricksRow`, this.bricksRow);
  return this.bricksRow;
};

Arkanoid.prototype.generateAndDrawPaddle = function () {
  this.paddleWidth = 100;
  var paddleX = (this.canvasWidth - this.paddleWidth) / 2;
  this.context.beginPath();
  this.context.rect(
    paddleX,
    this.canvasHeight - this.height,
    this.paddleWidth,
    this.height
  );
  this.context.fillStyle = this.generateRandomColor();
  this.context.fill();
  this.context.closePath();
};

Arkanoid.prototype.generateAndDrawBall = function () {
  this.ballDiameter = 10;
  var ballX = this.canvasWidth / 2;
  var ballY = this.canvasHeight - (this.height + this.ballDiameter);
  this.context.beginPath();
  this.context.arc(
    ballX,
    ballY,
    this.ballDiameter,
    0,
    Math.PI * this.ballDiameter
  );
  this.context.fillStyle = this.generateRandomColor();
  this.context.fill();
  this.context.closePath();
};
