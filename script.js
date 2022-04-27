// var arkanoid = new Arkanoid("canvas", {
//   rows: 7,
//   bricks: 4,
// });

var arkanoids = [
  new Arkanoid("canvas", {
    rows: 7,
    bricks: 4,
  }),

  new Arkanoid("canvas", {
    rows: 7,
    bricks: 4,
  }),

  new Arkanoid("canvas", {
    rows: 7,
    bricks: 4,
  }),

  new Arkanoid("canvas", {
    rows: 7,
    bricks: 4,
  }),
];

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
