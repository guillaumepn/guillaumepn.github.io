/**
* Ce module est appelé quand le joueur clique sur le bouton Play dans un niveau
* */
let main = require('../main');
let grid = main.grid;
let stage = main.stage;
let app = main.app;
let steps = main.steps;
let stepsObject = main.stepsObject;
let cat = main.cat;
let gameInstance = main.gameInstance;

// Données JSON de la map
const map = require('../assets/maps/map01');

let cnt = 0;
let timeOut = null;
let catDirection = map.player.originDirection;
let stopped = false;

module.exports = function runGame(action = 'run') {
  // Bouton Stop a été cliqué :
  if (action === 'stop') {
    stopGame();
    cat.x = stage.children[map.player.originTileId].infos.x;
    cat.y = stage.children[map.player.originTileId].infos.y;
    catDirection = map.player.originDirection;
  }
  // Bouton Play a été cliqué :
  else {
    stopped = false;
    cnt = 0;
    catDirection = map.player.originDirection;

    console.log("Game running");
    // console.log(app.renderer.width);
    // console.log(`${app.renderer.width} et ${app.renderer.height}`);

    if (!gameInstance) {
      requestAnimationFrame(readSteps);
    }
  }
};

function readSteps() {

  gameInstance = undefined;

  if (isOnMap(cat.x, cat.y) === 0) {
    console.log("test");
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

  if (isOnMap(cat.x, cat.y) > 0) {

    updateCounter();

    if (stepsObject[cnt].type !== 'empty' && !stopped) {
      timeOut = setTimeout(() => {
        if (!gameInstance)
          gameInstance = requestAnimationFrame(readSteps);
      }, 200);
    } else if (stepsObject[cnt].type === 'empty' && !stopped) {
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
      if (isOnMap(cat.x + 32, cat.y + 16) > 0) {
        cat.x += 32;
        cat.y += 16;
      } else
        stopGame();
      break;
    case 'west':
      if (isOnMap(cat.x - 32, cat.y + 16) > 0) {
        cat.x -= 32;
        cat.y += 16;
      } else
        stopGame();
      break;
    case 'north':
      if (isOnMap(cat.x - 32, cat.y - 16) > 0) {
        cat.x -= 32;
        cat.y -= 16;
      }
      else
        stopGame();
      break;
    case 'east':
      if (isOnMap(cat.x + 32, cat.y - 16) > 0) {
        cat.x += 32;
        cat.y -= 16;
      } else
        stopGame();
      break;
    default: break;
  }
}

function isOnMap(x, y) {
  return stage.children.filter((tile, i) => JSON.stringify(tile.location) === JSON.stringify({id: (i+1), x: x, y: y})).length;
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
  cancelAnimationFrame(gameInstance);
  clearTimeout(timeOut);
  stopped = true;
  gameInstance = undefined;
  steps.children.filter(step => {
    step.tint = 0xffffff;
  });
  console.log('game stopped');
}
