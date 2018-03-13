/*
* Ce module est appelé quand le joueur clique sur le bouton Play dans un niveau
* */

let main = require('../main');
let app = main.app;
let steps = main.steps;
let stepsObject = main.stepsObject;
let cat = main.cat;
let gameInstance = main.gameInstance;

let cnt = 0;
let timeOut;
let catInMap =
  cat.x >= 0 && cat.x < app.renderer.width &&
  cat.y >= 0 && cat.y < app.renderer.height;

module.exports = function runGame(action = 'run') {
  console.log(steps.children);
  console.log(stepsObject);
  // Bouton Stop a été cliqué :
  if (action === 'stop') {
    stopGame();
  }
  // Bouton Play a été cliqué :
  else {
    console.log("Game running");
    // console.log(app.renderer.width);
    // console.log(`${app.renderer.width} et ${app.renderer.height}`);

    if (!gameInstance)
      requestAnimationFrame(readSteps);
  }
};

function readSteps() {
  catInMap =
    cat.x >= 0 && cat.x < app.renderer.width &&
    cat.y >= 0 && cat.y < app.renderer.height;

  gameInstance = undefined;

  if (!catInMap) {
    stopGame();
  }

  steps.children.filter(step => {
    step.tint = 0xffffff;
  });

  steps.children[cnt].tint = 0xd7e5b0;
  console.log("frame running");

  switch (stepsObject[cnt].type) {
    case 'empty': break;
    case 'forward':
      cat.y += 32;
      break;
    default: break;
  }

  if (catInMap) {

    if (stepsObject[cnt].type !== 'empty') {
      updateCounter();
      timeOut = setTimeout(() => {
        if (!gameInstance)
          gameInstance = requestAnimationFrame(readSteps);
      }, 500);
    } else {
      updateCounter();
      if (!gameInstance)
        gameInstance = requestAnimationFrame(readSteps);
    }

  }
}

function updateCounter() {
  cnt++;
  if (cnt === 9) cnt = 0;
}

function stopGame() {
  clearTimeout(timeOut);
  // if (gameInstance)
  cancelAnimationFrame(gameInstance);
  gameInstance = undefined;
  steps.children.filter(step => {
    step.tint = 0xffffff;
  });
  console.log('game stopped');
}
