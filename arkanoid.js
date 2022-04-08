function Arkanoid(selector, rowBricks) {
  this.selector = selector;
  this.rowBricks = rowBricks;
  this.start();
}

Arkanoid.prototype.start = () => ({
  canvas: document.createElement("canvas"),
  startGame() {
    this.canvas.width = 480;
    this.canvas.height = 700;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.context.fillStyle = "rgb(241, 241, 241)";
    this.context.fillRect(15, 10, 700, 700);
  },
});
