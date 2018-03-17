/*
* Ce module est appelé quand le joueur clique sur le bouton Play dans un niveau
* */

let main = require('../main');
let grid = main.grid;
let app = main.app;
let steps = main.steps;
let stepsObject = main.stepsObject;
let cat = main.cat;
let gameInstance = main.gameInstance;

let cnt = 0;
let timeOut;
let catDirection = 'south';
let catInMap =
  cat.x >= 0 && cat.x < grid.getWidth() &&
  cat.y >= 0 && cat.y < grid.getHeight();

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
    cat.x >= 0 && cat.x < (grid.getWidth() - 32) &&
    cat.y >= 0 && cat.y < (grid.getHeight() - 32);

  gameInstance = undefined;

  if (!catInMap) {
    stopGame();
  }

  steps.children.filter(step => {
    step.tint = 0xffffff;
  });

  steps.children[cnt].tint = 0xd7e5b0;

  switch (stepsObject[cnt].type) {
    case 'empty': break;
    case 'forward':
      moveForward();
      break;
    case 'turnleft':
      turnLeft();
      break;
    case 'turnright':
      turnRight();
      break;
    default: break;
  }

  if (catInMap) {

    if (stepsObject[cnt].type !== 'empty') {
      updateCounter();
      console.log(cat.x + " " + grid.getWidth());
      timeOut = setTimeout(() => {
        if (!gameInstance)
          gameInstance = requestAnimationFrame(readSteps);
      }, 200);
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

function moveForward() {
  switch (catDirection) {
    case 'south':
      cat.y += 32;
      break;
    case 'west':
      cat.x -= 32;
      break;
    case 'north':
      cat.y -= 32;
      break;
    case 'east':
      cat.x += 32;
      break;
    default: break;
  }
}

function turnLeft() {
  switch (catDirection) {
    case 'south':
      catDirection = 'west';
      break;
    case 'west':
      catDirection = 'north';
      break;
    case 'north':
      catDirection = 'east';
      break;
    case 'east':
      catDirection = 'south';
      break;
    default: break;
  }
}

function turnRight() {
  switch (catDirection) {
    case 'south':
      catDirection = 'east';
      break;
    case 'west':
      catDirection = 'south';
      break;
    case 'north':
      catDirection = 'west';
      break;
    case 'east':
      catDirection = 'north';
      break;
    default: break;
  }
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
