function Arkanoid(selector, options) {
  this.selector = selector;

  this.options = {
    //canvas props
    canvasWidth: 450,
    canvasHeight: 400,
    tabIndex: 1000,

    //random props
    rows: 11,
    bricks: 5,

    //init brick & paddle height
    height: 15,

    //ball props
    dx: 3,
    dy: -3,
    ballDiameter: 10,

    //paddle props
    paddleWidth: 100,
    arrowVal: 5,

    ...options,
  };

  SPACE_KEY = 32;
  ARROW_RIGHT_KEY = 39;
  ARROW_LEFT_KEY = 37;

  //get canvas props
  this.canvas = document.querySelector(this.selector);
  this.canvas.width = this.options.canvasWidth;
  this.canvas.height = this.options.canvasHeight;
  this.canvas.tabIndex = this.options.tabIndex;
  this.context = this.canvas.getContext("2d");

  this.initGame();
}

Arkanoid.prototype.initGame = function () {
  // space key options
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
  ];

  //init and generate bricks
  this.bricksRow = [];
  var { bricks, rows, height, ballDiameter, paddleWidth } = this.options;

  this.rowsQty = this.r(bricks, rows);
  for (let row = 0; row < this.rowsQty; row++) {
    this.bricksRow[row] = [];
    var bricksQty = this.r(bricks, rows);
    var brickWidth = Math.ceil(this.canvas.width / bricksQty);
    for (let brick = 0; brick < bricksQty; brick++) {
      this.bricksRow[row][brick] = {
        x: 0,
        y: 0,
        color: "",
        brickWidth,
      };

      var brickObj = this.bricksRow[row][brick];
      this.brickX = brick * brickObj.brickWidth;
      this.brickY = row * height;
      brickObj.x = this.brickX;
      brickObj.y = this.brickY;
      brickObj.color = `rgb(${this.r()}, ${this.r()}, ${this.r()})`;
    }
  }

  //calc ball props
  this.ballX = this.canvas.width / 2;
  this.ballY = this.canvas.height - (3 * height + ballDiameter / 2);

  //calc paddle props
  this.paddleX = (this.canvas.width - paddleWidth) / 2;
  this.paddleY = this.canvas.height - (2 * height + ballDiameter);
  this.rightPressed = false;
  this.leftPressed = false;

  //collision counts
  this.collisionCount = 0;

  this.addMultipleListeners();
  this.loadGame(true);
};

// random  number generator
Arkanoid.prototype.r = function (min = 0, max = 255) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
      var brickObj = this.bricksRow[row][brick];
      brickCount++;
      if (
        this.ballX > brickObj.x &&
        this.ballX < brickObj.x + brickObj.brickWidth &&
        this.ballY - this.options.ballDiameter > brickObj.y &&
        this.ballY - this.options.ballDiameter <
          brickObj.y + this.options.height
      ) {
        this.options.dy = -this.options.dy;
        this.bricksRow[row].splice(brick, 1);
        brickCount--;
      }
    }
  }
  if (!brickCount) this.completingGame(`You win 🎉🎉🎉`);
};

Arkanoid.prototype.generateAndDrawPaddle = function () {
  this.context.beginPath();
  this.context.rect(
    this.paddleX,
    this.paddleY,
    this.options.paddleWidth,
    this.options.height
  );
  this.context.fillStyle = "#B0F63C";
  this.context.fill();
  this.context.closePath();
};

Arkanoid.prototype.drawBall = function () {
  this.context.beginPath();
  this.context.arc(
    this.ballX,
    this.ballY,
    this.options.ballDiameter,
    0,
    Math.PI * this.options.ballDiameter
  );
  this.context.fillStyle = "#0000ff";
  this.context.fill();
  this.context.closePath();
};

Arkanoid.prototype.drawBricks = function () {
  for (let row = 0; row < this.rowsQty; row++) {
    for (let brick = 0; brick < this.bricksRow[row].length; brick++) {
      var { x, y, color, brickWidth } = this.bricksRow[row][brick];
      this.context.beginPath();
      this.context.rect(x, y, brickWidth, this.options.height);
      this.context.fillStyle = color;
      this.context.fill();
      this.context.closePath();
    }
  }
};

Arkanoid.prototype.loadGame = function (isInit) {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.drawBricks();
  this.drawBall();
  this.generateAndDrawPaddle();
  this.collisionDetection();

  if (!isInit) {
    this.ballX += this.options.dx;
    this.ballY += this.options.dy;

    if (
      this.ballX + this.options.dx + this.options.ballDiameter >
        this.canvas.width ||
      this.ballX + this.options.dx - this.options.ballDiameter < 0
    ) {
      this.options.dx = -this.options.dx;
    }

    if (this.ballY + this.options.dy - this.options.ballDiameter < 0) {
      this.options.dy = -this.options.dy;
    } else if (
      this.ballY + this.options.dy + this.options.ballDiameter >
      this.paddleY
    ) {
      if (
        this.ballX > this.paddleX &&
        this.ballX + this.options.dx < this.paddleX + this.options.paddleWidth
        // && this.ballY + this.options.height - this.paddleY === 5
      ) {
        this.options.dy = -this.options.dy;
      }
      if (
        this.ballY + this.options.dy + this.options.ballDiameter >
        this.canvas.height
      ) {
        this.completingGame(`❗❗❗ Game is over ❗❗❗`);
      }
    }

    if (this.rightPressed) {
      this.paddleX += this.options.arrowVal;
      if (this.paddleX > this.canvas.width - this.options.paddleWidth) {
        this.paddleX = this.canvas.width - this.options.paddleWidth;
      }
    }

    if (this.leftPressed) {
      this.paddleX -= this.options.arrowVal;
      if (this.paddleX < 0) {
        this.paddleX = 0;
      }
    }
    this.stopLoading = requestAnimationFrame(() => this.loadGame(false));
  }
};

Arkanoid.prototype.keyDown = function (evt) {
  if (evt.keyCode === ARROW_RIGHT_KEY) this.rightPressed = true;
  if (evt.keyCode === ARROW_LEFT_KEY) this.leftPressed = true;

  if (evt.keyCode === SPACE_KEY && !this.spaceKeyPressed) {
    this.spaceKeyPressed = true;
    this.loadGame(false);
  }
};

Arkanoid.prototype.keyUp = function (evt) {
  if (evt.keyCode === ARROW_RIGHT_KEY) this.rightPressed = false;
  if (evt.keyCode === ARROW_LEFT_KEY) this.leftPressed = false;
};

Arkanoid.prototype.completingGame = function (status) {
  alert(status);
  cancelAnimationFrame(this.stopLoading);
  this.initGame();
  this.destroyEventListeners();
};
