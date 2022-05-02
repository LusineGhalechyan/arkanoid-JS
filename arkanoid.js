function Arkanoid(selector, options) {
  this.selector = selector;

  let defaultOptiions = {
    // random props
    rows: 11,
    bricks: 5,

    // init brick & paddle height
    height: 15,

    //ball props
    dx: 3,
    dy: -3,
    ballDiameter: 10,

    //paddle props
    paddleWidth: 100,
  };

  this.options = { ...options, ...defaultOptiions };

  //get canvas props
  // debugger;
  this.canvas = this.initCanvas(this.selector).canvasProps(this.selector);
  this.canvasWidth = this.canvas.getBoundingClientRect().width;
  this.canvasHeight = this.canvas.getBoundingClientRect().height;
  this.context = this.canvas.getContext("2d");
  // debugger;

  // random color's number generating
  this.r = () => parseInt(Math.random() * 256);

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
    {
      actionType: "reload",
      action: (evt) => this.reLoad(evt),
    },
  ];

  this.event = new CustomEvent("reload");

  //init and generate bricks
  this.bricksRow = [];
  this.rowsQty = this.generateRandomNumbers(
    this.options.bricks,
    this.options.rows
  );

  for (let row = 0; row < this.rowsQty; row++) {
    this.bricksRow[row] = [];
    this.bricksQty = this.generateRandomNumbers(
      this.options.bricks,
      this.options.rows
    );
    this.brickWidth = Math.ceil(this.canvasWidth / this.bricksQty);

    for (let brick = 0; brick < this.bricksQty; brick++) {
      this.bricksRow[row][brick] = {
        x: 0,
        y: 0,
        color: "",
        brickWidth: this.brickWidth,
        status: true,
      };

      this.brickX = brick * this.bricksRow[row][brick]["brickWidth"];
      this.brickY = row * this.options.height;
      this.bricksRow[row][brick]["x"] = this.brickX;
      this.bricksRow[row][brick]["y"] = this.brickY;
      this.bricksRow[row][brick][
        "color"
      ] = `rgb(${this.r()}, ${this.r()}, ${this.r()})`;
    }
  }

  //ball props
  this.ballX = this.canvasWidth / 2;
  this.ballY =
    this.canvasHeight -
    (3 * this.options.height + this.options.ballDiameter / 2);

  //paddle props
  this.paddleX = (this.canvasWidth - this.options.paddleWidth) / 2;
  this.paddleY =
    this.canvasHeight - (2 * this.options.height + this.options.ballDiameter);
  this.rightPressed = false;
  this.leftPressed = false;

  //collision counts
  this.collisionCount = 0;

  this.initCanvas();
  this.addMultipleListeners();
  this.loadGame(true);
};

Arkanoid.prototype.initCanvas = (selector) => ({
  canvas: document.querySelector(selector),
  canvasProps(selector) {
    this.canvas.width = 450;
    this.canvas.height = 400;
    this.canvas.tabIndex = 1000;
    return this.canvas;
  },
});

Arkanoid.prototype.reLoad = function () {
  this.initGame();
};

Arkanoid.prototype.generateRandomNumbers = function (min, max) {
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
      this.brickObj = this.bricksRow[row][brick];
      brickCount++;
      if (this.brickObj["status"]) {
        if (
          this.ballX > this.brickObj["x"] &&
          this.ballX < this.brickObj["x"] + this.brickObj["brickWidth"] &&
          this.ballY - this.options.ballDiameter > this.brickObj["y"] &&
          this.ballY - this.options.ballDiameter <
            this.brickObj["y"] + this.options.height
        ) {
          this.options.dy = -this.options.dy;
          this.brickObj["status"] = false;
          this.collisionCount++;
        }
      }
    }
  }
  if (this.collisionCount === brickCount) this.completingGame(`You win 🎉🎉🎉`);
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
      var { x, y, color, brickWidth, status } = this.bricksRow[row][brick];
      if (!status) continue;
      this.context.beginPath();
      this.context.rect(x, y, brickWidth, this.options.height);
      this.context.fillStyle = color;
      this.context.fill();
      this.context.closePath();
    }
  }
};

Arkanoid.prototype.loadGame = function (isInit) {
  this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  this.drawBricks();
  this.drawBall();
  this.generateAndDrawPaddle();
  this.collisionDetection();

  if (!isInit) {
    this.ballX += this.options.dx;
    this.ballY += this.options.dy;
    if (
      this.ballX + this.options.dx + this.options.ballDiameter >
        this.canvasWidth ||
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
        this.canvasHeight
      ) {
        this.completingGame(`❗❗❗ Game is over ❗❗❗`);
      }
    }

    if (this.rightPressed) {
      this.paddleX += 5;
      if (this.paddleX > this.canvasWidth - this.options.paddleWidth) {
        this.paddleX = this.canvasWidth - this.options.paddleWidth;
      }
    }

    if (this.leftPressed) {
      this.paddleX -= 5;
      if (this.paddleX < 0) {
        this.paddleX = 0;
      }
    }
    this.stopLoading = requestAnimationFrame(() => this.loadGame(false));
  }
};

Arkanoid.prototype.keyDown = function (evt) {
  if (evt.key === "ArrowRight") this.rightPressed = true;
  if (evt.key === "ArrowLeft") this.leftPressed = true;

  if (evt.key === " " && !this.spaceKeyPressed) {
    this.spaceKeyPressed = true;
    this.loadGame(false);
  }
};

Arkanoid.prototype.keyUp = function (evt) {
  if (evt.key === "ArrowRight") this.rightPressed = false;
  if (evt.key === "ArrowLeft") this.leftPressed = false;
};

Arkanoid.prototype.completingGame = function (status) {
  alert(status);
  this.canvas.dispatchEvent(this.event);
  this.destroyEventListeners();
};
