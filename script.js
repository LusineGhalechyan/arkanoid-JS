var arkanoid = new Arkanoid(".test", {
  rows: 7,
  bricks: 4,
  // canvasWidth: 500
});

var arkanoid = new Arkanoid(".game", {
  rows: 10,
  bricks: 10,
});

// var arkanoids = [
//   new Arkanoid(".test", {
//     rows: 7,
//     bricks: 4,
//   }),

//   new Arkanoid(".game", {
//     rows: 6,
//     bricks: 4,
//   }),

//   new Arkanoid(".swim", {
//     rows: 5,
//     bricks: 4,
//   }),

//   new Arkanoid(".run", {
//     rows: 4,
//     bricks: 4,
//   }),
// ];

// document.addEventListener("keydown", (evt) => {
//   setInterval(() => {
//     for (let i = 0; i < arkanoids.length; i++) {
//       if (evt.key === arkanoids[i].rightArrowKey)
//         arkanoids[i].rightPressed = true;
//       if (evt.key === arkanoids[i].leftArrowKey)
//         arkanoids[i].leftPressed = true;
//       if (evt.key === arkanoids[i].spaceKey && !arkanoids[i].spaceKeyPressed) {
//         // arkanoids[i].spaceKeyPressed = true;
//         arkanoids[i].loadGame();
//       }
//     }
//   }, 10);
// });
