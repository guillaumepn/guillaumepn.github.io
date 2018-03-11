/*
*
* Ce module est appelé quand le joueur clique sur le bouton Play dans un niveau
*
* */

let main = require('../main');
let app = main.app;
let steps = main.steps;
let stepsObject = main.stepsObject;
let cat = main.cat;
let gameInstance = main.gameInstance;

module.exports = function runGame(action = 'run') {
  if (action === 'stop') {
    clearInterval(gameInstance);
    console.log('game stoppped');
  } else {
    console.log("Game running");
    console.log(app.renderer.width);
    console.log(`${app.renderer.width} et ${app.renderer.height}`);

    const catInMap =
      cat.x >= 0 && cat.x < app.renderer.width &&
      cat.y >= 0 && cat.y < app.renderer.height;

    let cnt = 0;

    gameInstance = setInterval(() => {
      console.log("interval running");
      switch (stepsObject[cnt].type) {
        case 'empty': break;
        case 'forward':
          cat.y += 32;
          break;
        default: break;
      }
      cnt++;
      if (cnt === 9) cnt = 0;
    }, 500);
  }
};
