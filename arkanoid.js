function Arkanoid(selector, rowBricks) {
  this.selector = selector;
  this.rowBricks = rowBricks;
  this.start();
  this.generateRandomBricksRow();
  this.drawBricks();
  this.generateAndDrawPaddle();
  this.generateAndDrawBall();
}

Arkanoid.prototype.start = () => ({
  canvas: document.createElement("canvas"),
  startGame(selector) {
    this.canvas.width = 480;
    this.canvas.height = 700;
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

Arkanoid.prototype.generateRandomBricksRow = function () {
  this.rowsQty = Math.floor(Math.random() * 11 + 1) || this.rowBricks.rows;
  this.bricksQty = Math.floor(Math.random() * 7 + 1) || this.rowBricks.bricks;
  this.bricksRow = new Array(this.rowsQty);
  this.canvas = this.start().startGame(this.selector);
  this.canvasWidth = this.canvas.getBoundingClientRect().width;
  this.canvasHeight = this.canvas.getBoundingClientRect().height;
  this.brickWidth = parseInt(this.canvasWidth / this.bricksQty);
  this.height = 15;

  for (let row = 0; row < this.bricksRow.length; row++) {
    this.bricksRow[row] = new Array(this.bricksQty);
    for (let brick = 0; brick < this.bricksQty; brick++) {
      this.bricksRow[row][brick] = { x: 0, y: 0 };
    }
  }
  return this.bricksRow;
};

Arkanoid.prototype.drawBricks = function () {
  this.context = this.canvas.getContext("2d");
  for (let row = 0; row < this.bricksRow.length; row++) {
    for (let brick = 0; brick < this.bricksQty; brick++) {
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

Arkanoid.prototype.generateAndDrawPaddle = function () {
  this.paddleWidth = 75;
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
