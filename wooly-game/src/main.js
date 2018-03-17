// import Vue from 'vue'
// import App from './App.vue'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })

/**
 * Game code (with Pixi.js as 2D WebGL Renderer)
 * Chargement de Pixi.js et du CSS
 */
require('./assets/scss/app.scss');
require('pixi.js');
let _ = require('lodash');

let logs = [];


/**
 * Composants
 */
const Grid = require('./components/grid');
const Step = require('./components/step');
const Sprite = require('./components/sprite');


// Affiche la version de Pixijs dans la console du navigateur
PIXI.utils.sayHello();

/**
 * App du jeu
 * Dimensions du canvas par défaut: 800 * 600
 */
let app = new PIXI.Application({
  width: 960,
  height: 480,
  resolution: 1,
  transparent: true
});

// Ajouter le <canvas> du jeu dans la <div id='app'>
document.getElementById('app').appendChild(app.view);

// Création du container global
let container = new PIXI.Container();

// Création du container du niveau
let stage = new PIXI.Graphics();
stage.beginFill(0xb8e994);
stage.drawRect(0, 0, 640, (app.renderer.height - 32));

// Création du container du menu
let menu = new PIXI.Graphics();
menu.beginFill(0xfad390);
menu.drawRect(0, 0, 320, (app.renderer.height - 32));
menu.position.set(640, 0);

// Ajout des sous-containers dans le container global
container.addChild(stage);
container.addChild(menu);


/**
 * Chargement des sprites/images
 */
PIXI.loader
  .add("forward", "./src/assets/images/forward.png")
  .add("turnleft", "./src/assets/images/turnleft.png")
  .add("turnright", "./src/assets/images/turnright.png")
  .add("wait", "./src/assets/images/wait.png")
  .add("play", "./src/assets/images/play.png")
  .add("pause", "./src/assets/images/pause.png")
  .load(setup);

/**
 * La map
 */
// Dessine la grille sur la map (voir ./components/grid.js)
let grid = new Grid(20, 14, 32, 32, stage);
grid.draw();

let cat = PIXI.Sprite.fromImage('./src/assets/images/a-cat.svg');


/**
 * Le menu
 */
// Barre des actions possibles (dans le menu en bas)
let actions = new PIXI.Container();
menu.addChild(actions);

let forward;
let turnleft;
let turnright;
let wait;

// Barre des steps que le chat fera (dans le menu en haut)
let stepsArea = new PIXI.Container();
let steps = new PIXI.Container();
let stepsObject = [];
stepsArea.addChild(steps);

menu.addChild(stepsArea);
// On crée 10 steps vides, 5 sur chaque ligne...
for (let y = 0; y < 2; y++) {
  for (let x = 0; x < 5; x++) {
    let step = new Step(x * 32, y * 32, 31, 31, 'empty', steps);
    step.draw();
    stepsObject.push(step);
  }
}

// ... puis on supprime la dernière, pour mettre le bouton PLAY à la place après
steps.children.pop();
stepsObject.pop();

menu.setChildIndex(stepsArea, 0);

let gameInstance = undefined;

/**
 * setup: au chargement de la page / du niveau
 */
function setup() {
  /**
   * Map du jeu
   */

  cat.x = 0;
  cat.y = 0;

  // On ajoute notre chat à notre niveau
  stage.addChild(cat);


  /**
   * Menu
   */
  // On positionne les steps en haut et centré dans le menu
  stepsArea.x = (stepsArea.parent.width / 2) - (stepsArea.width / 2);
  stepsArea.y = 128;
  // et le bouton Play en bas à gauche des steps
  let play = new Sprite('play', 'play', 128, 32);
  play.x = 128;
  play.y = 32;
  play.interactive = true;
  play.buttonMode = true;
  stepsArea.addChild(play);

  // Icones d'action
  forward = new Sprite('forward', 'forward');
  forward.x = 0;

  turnleft = new Sprite('turnleft', 'turnleft', 32);
  turnleft.x = 32;

  turnright = new Sprite('turnright', 'turnright', 64);
  turnright.x = 64;

  wait = new Sprite('wait', 'wait', 96);
  wait.x = 96;

  actions.addChild(forward, turnleft, turnright, wait);

  // On positionne notre barre d'actions en bas et centré dans le menu
  actions.x = (actions.parent.width / 2) - (actions.width / 2);
  actions.y = actions.parent.height - 128;

  // // Pour chacun des boutons d'action, on les rend interactif pour pouvoir les cliquer,
  // // drag'n'drop, etc, et on associe ces events aux fonctions dans ./functions
  // const onHover = require('./functions/onHover');
  // const onOut = require('./functions/onOut');
  // const onDragStart = require('./functions/onDragStart');
  // const onDragEnd = require('./functions/onDragEnd');
  // const onDragMove = require('./functions/onDragMove');

  // for (let action of actions.children) {
  //   action.interactive = true;
  //   action.buttonMode = true;
  //   action.anchor.set(0.5, 0.5);
  //   action
  //     .on('pointerover', onHover)
  //     .on('pointerout', onOut)
  //     .on('pointerdown', onDragStart)
  //     .on('pointerup', onDragEnd)
  //     .on('pointerupoutside', onDragEnd)
  //     .on('pointermove', onDragMove);
  // }

  checkActions();


  let mapText = new PIXI.Text('map');
  mapText.x = 20;
  mapText.y = stage.height;
  stage.addChild(mapText);

  let menuText = new PIXI.Text('menu');
  menuText.x = 20;
  menuText.y = menu.height;
  menu.addChild(menuText);


  // Quand on clique sur le bouton Play du menu
  let runGame = require('./functions/runGame');
  let gameRunning = false;

  play.click = function () {
    gameRunning = !gameRunning;
    // On lance le jeu SI il y a au moins une step définie avec une action
    if (gameRunning && stepsObject.filter(step => step.type !== 'empty').length > 0) {
      runGame('run');
      play.changeSprite("pause");
      logs.push('Ca marche !');
    }
    // Sinon, on ne lance pas le jeu, ou on le stoppe s'il était lancé
    else {
      runGame('stop');
      play.changeSprite("play");
      logs.push('Ca s\'arrête !');
    }
    writeLogs();
  };


  // On lance la fonction loop qui se répètera à chaque frame
  loop();
}


/**
 * loop: se répète à chaque frame
 */
function loop() {
  requestAnimationFrame(loop);

  app.renderer.render(container);
}

function checkActions() {

  // Pour chacun des boutons d'action, on les rend interactif pour pouvoir les cliquer,
  // drag'n'drop, etc, et on associe ces events aux fonctions dans ./functions
  const onHover = require('./functions/onHover');
  const onOut = require('./functions/onOut');
  const onDragStart = require('./functions/onDragStart');
  const onDragEnd = require('./functions/onDragEnd');
  const onDragMove = require('./functions/onDragMove');

  for (let action of actions.children) {
    action.interactive = true;
    action.buttonMode = true;
    action.anchor.set(0.5, 0.5);
    action
      .on('pointerover', onHover)
      .on('pointerout', onOut)
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);
  }
}


// Affichage des logs :
let logsDiv = document.querySelector('#logs');
function writeLogs() {
  logsDiv.innerHTML = '';
  for (let log of logs) {
    let logHtml = document.createElement('div');
    logHtml.setAttribute('class', 'log');
    logHtml.innerHTML = `<div>${log}</div>`;
    logsDiv.appendChild(logHtml);
  }
}

// A la fin, on exporte vers l'extérieur l'accès aux variables pour les fichiers qui en ont besoin
// (exemple : la variable steps utilisée dans ./functions/onDragMove.js)
module.exports = {
  app,
  grid,
  actions,
  stepsArea,
  steps,
  stepsObject,
  cat,
  gameInstance,
  checkActions
};
