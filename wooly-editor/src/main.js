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
const IsoGrid = require('./components/isogrid');
const Step = require('./components/step');
const Trigger = require('./components/trigger');
const Sprite = require('./components/sprite');

// Functions

// Map du niveau (JSON)
const map = require('./assets/maps/map01');

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
// stage.beginFill(0xb8e994);
stage.beginFill(0xffffff);
stage.drawRect(0, 0, 640, (app.renderer.height - 32));

// Création du container du menu de jeu
let menu = new PIXI.Graphics();
menu.beginFill(0xfad390);
menu.drawRect(0, 0, 320, (app.renderer.height - 32));
menu.position.set(640, 0);

// Création du container du menu de l'éditeur
let editor = new PIXI.Graphics();
editor.beginFill(0xffedce);
editor.drawRect(0, 0, 320, (app.renderer.height - 32));
editor.position.set(640, 0);

// Ajout des sous-containers dans le container global
container.addChild(stage);
container.addChild(menu);
container.addChild(editor);


/**
 * Chargement des sprites/images
 */
PIXI.loader
  .add("forward", "./src/assets/images/move.png")
  .add("turnleft", "./src/assets/images/clockwise.png")
  .add("turnright", "./src/assets/images/anticlockwise.png")
  .add("wait", "./src/assets/images/wait.png")
  .add("play", "./src/assets/images/play.png")
  .add("pause", "./src/assets/images/pause.png")
  .add("tooltip", "./src/assets/images/tooltip.png")
  .add("trigger-top", "./src/assets/images/trigger-top.png")
  .add("trigger-bottom", "./src/assets/images/trigger-bottom.png")
  .add("trigger-block-if", "./src/assets/images/trigger-block-if.png")
  .add("trigger-block-while", "./src/assets/images/trigger-block-while.png")
  .add("trigger-block-until", "./src/assets/images/trigger-block-until.png")
  .add("settrigger-top", "./src/assets/images/settrigger-top.png")
  .add("settrigger-bottom", "./src/assets/images/settrigger-bottom.png")
  // Cat character sprites
  .add("catanim1", "./src/assets/images/catanim1.png")
  .add("catanim2", "./src/assets/images/catanim2.png")
  .add("catanim3", "./src/assets/images/catanim3.png")
  .add("catanim4", "./src/assets/images/catanim4.png")
  // JSON map data
  .add("map", "./src/assets/maps/map01.json")
  // Map textures (tiles & objets)
  // // tiles
  .add("grass", "./src/assets/images/test-grass.png")
  .add("water", "./src/assets/images/test-water.png")
  .add("stone", "./src/assets/images/stone.png")
  .add("sand", "./src/assets/images/sand.png")
  .add("ice", "./src/assets/images/ice.png")
  // // objects
  .add("tree", "./src/assets/images/test-tree.png")
  .add("wall", "./src/assets/images/test-wall.png")
  .add("stone1", "./src/assets/images/stone1.png")
  .add("stone2", "./src/assets/images/stone2.png")
  .add("bush", "./src/assets/images/bush.png")
  // Editor textures (tiles & objets)
  // // Editor textures
  .add("editor-grass", "./src/assets/images/editor-grass.png")
  .add("editor-grass-focus", "./src/assets/images/editor-grass-focus.png")
  .add("editor-water", "./src/assets/images/editor-water.png")
  .add("editor-water-focus", "./src/assets/images/editor-water-focus.png")
  .add("editor-stone", "./src/assets/images/editor-stone.png")
  .add("editor-stone-focus", "./src/assets/images/editor-stone-focus.png")
  .add("editor-sand", "./src/assets/images/editor-sand.png")
  .add("editor-sand-focus", "./src/assets/images/editor-sand-focus.png")
  .add("editor-ice", "./src/assets/images/editor-ice.png")
  .add("editor-ice-focus", "./src/assets/images/editor-ice-focus.png")
  // // Editor objects
  .add("editor-tree", "./src/assets/images/editor-tree.png")
  .add("editor-tree-focus", "./src/assets/images/editor-tree-focus.png")
  .add("editor-stone1", "./src/assets/images/editor-stone1.png")
  .add("editor-stone1-focus", "./src/assets/images/editor-stone1-focus.png")
  .add("editor-wall", "./src/assets/images/editor-wall.png")
  .add("editor-wall-focus", "./src/assets/images/editor-wall-focus.png")
  .add("editor-eraser", "./src/assets/images/editor-eraser.png")
  .add("editor-eraser-focus", "./src/assets/images/editor-eraser-focus.png")
  .load((loader, resources) => {

    const onHover = require('./functions/onHover');
    const onOut = require('./functions/onOut');

    // console.log(resources["map"].data.player);

    let catframes = [];

    for (let i = 1; i < 5; i++) {
      catframes.push(PIXI.Texture.fromFrame('./src/assets/images/catanim'+ i +'.png'));
    }

    let cat = new PIXI.extras.AnimatedSprite(catframes);
    cat.animationSpeed = 0.1;

    /**
     * La map
     */
// Dessine la grille sur la map (voir ./components/grid.js)

    let grid = new IsoGrid(10, 14, 64, 32, stage);


    /**
     * L'éditeur
     */
    let tileEditorArea = new PIXI.Container();
    tileEditorArea.name = 'tile-editor';
    tileEditorArea.x = 32;
    tileEditorArea.y = 32;
    let objectEditorArea = new PIXI.Container();
    objectEditorArea.name = 'object-editor';
    objectEditorArea.x = 32;
    objectEditorArea.y = 96;
    editor.addChild(tileEditorArea);
    editor.addChild(objectEditorArea);

    /**
     * Le menu
     */
// Barre des actions possibles (dans le menu en bas)
    let actions = new PIXI.Container();
    let triggerActions = new PIXI.Container();
    menu.addChild(actions);
    menu.addChild(triggerActions);

// Actions
    let forward;
    let turnleft;
    let turnright;
    let wait;
// Déclencheurs
    let ifTrigger;
    let whileTrigger;
    let untilTrigger;

// Zone des tooltips
    let tooltips = new PIXI.Container();
    menu.addChild(tooltips);
    editor.addChild(tooltips);

// Barre des steps que le chat fera (dans le menu en haut)
    let stepsArea = new PIXI.Container();
    let steps = new PIXI.Container();
    let triggers = new PIXI.Container();
    let stepsObject = [];
    let triggersObject = [];

    stepsArea.addChild(steps);
    stepsArea.addChild(triggers);

    menu.addChild(stepsArea);
// On crée 10 steps vides, 5 sur chaque ligne...
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 5; x++) {
        let step = new Step(x * 32, (y * 32) + 48, 32, 32, 'empty', steps);
        let trigger = undefined;
        if (y === 0)
          trigger = new Trigger(x * 32, y, 'empty', triggers, 'trigger-top');
        else
          trigger = new Trigger(x * 32, (y * 32) + 80, 'empty', triggers, 'trigger-bottom');
        trigger.tooltip = "Rien pour l'instant";
        tooltips.addChild(trigger.tooltip);

        step.draw();

        stepsObject.push(step);
        triggersObject.push(trigger);
      }
    }

// ... puis on supprime la dernière, pour mettre le bouton PLAY à la place après
    steps.children.pop();
    triggers.children.pop();
    stepsObject.pop();
    triggersObject.pop();

    menu.setChildIndex(stepsArea, 0);

    let gameInstance = undefined;


    /**
     * Map du jeu
     */
    grid.draw();

    cat.anchor.set(0.5, 1);
    // Appelle les données JSON du joueur dans le fichier assets/maps/**.json
    let tiles = stage.children.filter(child => child.type === 'MapTile');
    cat.x = tiles[resources["map"].data.player.originTileId].infos.x;
    cat.y = tiles[resources["map"].data.player.originTileId].infos.y;

    // On ajoute notre chat à notre niveau
    stage.addChild(cat);

    /**
     * GAME CODE
     */

    // On positionne les steps en haut et centré dans le menu
    stepsArea.x = (stepsArea.parent.width / 2) - (stepsArea.width / 2);
    stepsArea.y = 60;


    // et le bouton Play en bas à gauche des steps
    let play = new Sprite('play', 'play', 128, 80);
    play.x = 128;
    play.y = 80;
    play.interactive = true;
    play.buttonMode = true;
    stepsArea.addChild(play);
    play
      .on('pointerover', onHover)
      .on('pointerout', onOut);
    play.hasTooltip = true;
    play.tooltip = 'Exécute la série des actions en boucle';
    tooltips.addChild(play.tooltip);

    // Icones d'action
    forward = new Sprite('forward', 'forward');
    forward.x = 0;
    forward.hasTooltip = true;
    forward.tooltip = 'Fait avancer le chat d\'une case dans sa direction actuelle';
    tooltips.addChild(forward.tooltip);

    turnleft = new Sprite('turnleft', 'turnleft', 32);
    turnleft.x = 32;
    turnleft.hasTooltip = true;
    turnleft.tooltip = 'Change la direction du chat de 90° dans le sens des aiguilles d\'une montre';
    tooltips.addChild(turnleft.tooltip);

    turnright = new Sprite('turnright', 'turnright', 64);
    turnright.x = 64;
    turnright.hasTooltip = true;
    turnright.tooltip = 'Change la direction du chat de 90° dans le sens inverse des aiguilles d\'une montre';
    tooltips.addChild(turnright.tooltip);

    wait = new Sprite('wait', 'wait', 96);
    wait.x = 96;
    wait.hasTooltip = true;
    wait.tooltip = 'Attend (sert à rien pour l\'instant - ptet à virer)';
    tooltips.addChild(wait.tooltip);

    actions.addChild(forward, turnleft, turnright, wait);

    // Icones de déclencheurs
    ifTrigger = new Sprite('trigger-block-if', 'trigger-block-if');
    ifTrigger.x = 0;
    ifTrigger.originX = 0;
    ifTrigger.type = 'trigger';
    ifTrigger.hasTooltip = true;
    ifTrigger.tooltip = '"Si" : Exécute l\'action si la condition est vraie';
    tooltips.addChild(ifTrigger.tooltip);

    triggerActions.addChild(ifTrigger);

    whileTrigger = new Sprite('trigger-block-while', 'trigger-block-while');
    whileTrigger.x = 32;
    whileTrigger.originX = 32;
    whileTrigger.type = 'trigger';
    whileTrigger.hasTooltip = true;
    whileTrigger.tooltip = '"Pendant" : Exécute l\'action pendant un certain temps';
    tooltips.addChild(whileTrigger.tooltip);

    triggerActions.addChild(whileTrigger);

    untilTrigger = new Sprite('trigger-block-until', 'trigger-block-until');
    untilTrigger.x = 64;
    untilTrigger.originX = 64;
    untilTrigger.type = 'trigger';
    untilTrigger.hasTooltip = true;
    untilTrigger.tooltip = '"Tant que" : Exécute l\'action tant que la condition est vraie';
    tooltips.addChild(untilTrigger.tooltip);

    triggerActions.addChild(untilTrigger);

    // On positionne notre barre d'actions en bas et centré dans le menu,
    // et la barre des déclencheurs
    actions.x = (actions.parent.width / 2) - (actions.width / 2);
    actions.y = actions.parent.height - 160;

    triggerActions.x = (triggerActions.parent.width / 2) - (triggerActions.width / 2);
    triggerActions.y = triggerActions.parent.height - 128;

    // On positionne la zone où les tooltips s'afficheront
    tooltips.x = 0;
    tooltips.y = tooltips.parent.height - 96;


    let mapText = new PIXI.Text('map');
    mapText.x = 20;
    mapText.y = stage.height;
    stage.addChild(mapText);

    let menuText = new PIXI.Text('menu');
    menuText.x = 20;
    menuText.y = menu.height;
    menu.addChild(menuText);

    let editorText = new PIXI.Text('editor');
    editorText.x = 20;
    editorText.y = editor.height;
    editor.addChild(editorText);

    menu.visible = false;

    // Toggle menu / editor
    document.querySelector('.switchMenu').addEventListener('click', function () {
      menu.visible = !menu.visible;
      editor.visible = !editor.visible;
    });

    // Set map id
    document.querySelector('.uniq').addEventListener('click', function () {
      map.id = Math.random().toString(36).substr(2, 9);
      console.log(map.id);
    });


    function checkActions() {

      // Pour chacun des boutons d'action, on les rend interactif pour pouvoir les cliquer,
      // drag'n'drop, etc, et on associe ces events aux fonctions dans ./functions
      const onHover = require('./functions/onHover');
      const onOut = require('./functions/onOut');
      const onDragStart = require('./functions/onDragStart');
      const onDragEnd = require('./functions/onDragEnd');
      const onDragMove = require('./functions/onDragMove');
      const onClick = require('./functions/onClick');

      // Boutons d'actions
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

      // Boutons de déclencheurs
      for (let trigger of triggerActions.children) {
        trigger.interactive = true;
        trigger.buttonMode = true;
        trigger.anchor.set(0.5, 0.5);
        trigger
          .on('pointerover', onHover)
          .on('pointerout', onOut)
          .on('pointerdown', onDragStart)
          .on('pointerup', onDragEnd)
          .on('pointerupoutside', onDragEnd)
          .on('pointermove', onDragMove);
      }

      //   Cases de déclencheurs
      triggersObject.filter(triggerObject => {
        triggerObject.interactive = true;
        triggerObject.buttonMode = true;
        triggerObject.on('click', onClick);
      });

    }


    /**
     *  EDITOR CODE
     */

    let editorTileButtons = {
      // nom_texture: texte_tooltip
      'grass': 'Herbe :\nAjoute une texture d\'herbe au sol.',
      'water': 'Eau :\nAjoute une texture d\'eau au sol.\nLa partie est perdue si le chat tombe sur cette case.',
      'stone': 'Pierre :\nAjoute une texture de pierre au sol.',
      'sand': 'Sable :\nAjoute une texture de sable au sol.',
      'ice': 'Glace :\nAjoute une texture de sable au sol.\nLe chat suivra sa trajectoire tant qu\'il ne sera pas bloqué.',
    };

    let editorObjectButtons = {
      // nom_texture: texte_tooltip
      'tree': 'Arbre :\nAjoute un objet arbre.\nAgit comme un mur.',
      'stone1': 'Rocher :\nAjoute un objet rocher.\nAgit comme un mur.',
      'wall': 'Mur :\nAjoute un objet mur.\nEst bloquant.',
      'eraser': 'Gomme :\nEfface un objet sur la carte.',
    };

    let index = 0;

    for (let texture in editorTileButtons) {
      let textureSprite = new Sprite('editor-'+texture, 'editor-'+texture, 0);
      textureSprite.x = index * 48;
      textureSprite.originX = index * 48;
      textureSprite.type = 'tile';
      textureSprite.hasTooltip = true;
      textureSprite.tooltip = editorTileButtons[texture];
      tooltips.addChild(textureSprite.tooltip);
      tileEditorArea.addChild(textureSprite);
      index++;
    }

    index = 0;

    for (let texture in editorObjectButtons) {
      let textureSprite = new Sprite('editor-'+texture, 'editor-'+texture, 0);
      textureSprite.x = index * 48;
      textureSprite.originX = index * 48;
      textureSprite.type = 'object';
      textureSprite.hasTooltip = true;
      textureSprite.tooltip = editorObjectButtons[texture];
      tooltips.addChild(textureSprite.tooltip);
      objectEditorArea.addChild(textureSprite);
      index++;
    }


    /* Events pour les boutons de l'éditeur */

    function checkEditorActions() {

      // Pour chacun des boutons d'action, on les rend interactif pour pouvoir les cliquer,
      // drag'n'drop, etc, et on associe ces events aux fonctions dans ./functions
      const onHover = require('./functions/editor/buttons/onHover');
      const onOut = require('./functions/editor/onOut');
      const onClick = require('./functions/editor/buttons/onClick');

      for (let tile of tileEditorArea.children) {
        tile.interactive = true;
        tile.buttonMode = true;
        tile.anchor.set(0.5, 0.5);
        tile
          .on('pointerover', onHover)
          .on('pointerout', onOut)
          .on('click', onClick);
      }

      for (let object of objectEditorArea.children) {
        object.interactive = true;
        object.buttonMode = true;
        object.anchor.set(0.5, 0.5);
        object
          .on('pointerover', onHover)
          .on('pointerout', onOut)
          .on('click', onClick);
      }

    }


    module.exports = {
      app,
      map,
      grid,
      stage,
      actions,
      triggerActions,
      menu,
      editor,
      stepsArea,
      steps,
      triggers,
      stepsObject,
      triggersObject,
      tooltips,
      tileEditorArea,
      objectEditorArea,
      cat,
      gameInstance
    };

    // Quand on clique sur le bouton Play du menu
    let runGame = require('./functions/runGame');
    let gameRunning = false;

    play.click = function () {
      gameRunning = !gameRunning;
      // On lance le jeu SI il y a au moins une step définie avec une action
      if (gameRunning && stepsObject.filter(step => step.type !== 'empty').length > 0) {
        runGame('run');
        play.changeSprite('pause');
        logs.push('Ca marche !');
      }
      // Sinon, on ne lance pas le jeu, ou on le stoppe s'il était lancé
      else {
        runGame('stop');
        play.changeSprite('play');
        logs.push('Ca s\'arrête !');
      }
      writeLogs();
    };

    // // Pour chacun des boutons d'action et déclencheurs, on les rend interactif pour pouvoir les cliquer,
    // // drag'n'drop, etc, et on associe ces events aux fonctions dans ./functions
    checkActions();
    checkEditorActions();


    // Get JSON from map
    document.querySelector('.getJson').addEventListener('click', function () {
      let jsonInput = document.querySelector('.mapjson');
      jsonInput.style.display = 'block';
      jsonInput.value = JSON.stringify(map);
      jsonInput.focus();
      jsonInput.select();
      document.execCommand("copy");
      jsonInput.style.display = 'none';
      alert("json de la map ajouté à ton clipboard mon srab sûr");
    });


    // On lance la fonction loop qui se répètera à chaque frame
    loop();


    /**
     * loop: se répète à chaque frame
     */
    function loop() {
      requestAnimationFrame(loop);
      app.renderer.render(container);
    }

  });


/**
 * Code JS, en dehors de PIXI / du <canvas>
 */

// Affichage des logs (sous le canvas) :
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

