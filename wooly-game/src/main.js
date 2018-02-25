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

/**
 * Composants
 *
 * @type {Grid}
 */
const Grid = require('./components/grid');
const Step = require('./components/step');

/**
 * Fonctions
 */
const onHover = require('./functions/onHover');
const onOut = require('./functions/onOut');
const onDragStart = require('./functions/onDragStart');
const onDragEnd = require('./functions/onDragEnd');
const onDragMove = require('./functions/onDragMove');

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
    .add("cat", "./src/assets/images/a-cat.svg")
    .add("forward", "./src/assets/images/forward.png")
    .add("turnleft", "./src/assets/images/turnleft.png")
    .add("turnright", "./src/assets/images/turnright.png")
    .add("wait", "./src/assets/images/wait.png")
    .load(setup);

/**
 * La map
 */
// Dessine la grille sur la map (voir ./components/grid.js)
let grid = new Grid(20, 14, 32, 32, stage);
grid.draw();

let cat;


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
let steps = new PIXI.Container();
menu.addChild(steps);
// On crée 10 steps vides, 5 sur chaque ligne...
for (let y = 0; y < 2; y++) {
    for (let x = 0; x < 5; x++) {
        let step = new Step(x * 32, y * 32, 32, 32, '', steps);
        step.draw();
    }
}
// ... puis on supprime la dernière, pour mettre le bouton PLAY à la place après
steps.children.pop();

menu.setChildIndex(steps, 0);

/**
 * setup: au chargement de la page / du niveau
 */
function setup() {
    /**
     * Map du jeu
     */
    // On crée notre chat à partir du sprite
    cat = new PIXI.Sprite(
        PIXI.loader.resources['cat'].texture
    );

    // cat.scale.set(0.1, 0.1);
    // xxx.anchor.set(...) : Définit le point d'origine du sprite (avec 0.5 => au milieu)
    // cat.anchor.set(0.5, 0.5);
    cat.x = 0;
    cat.y = 0;

    // On le rend "interactif" pour pouvoir utiliser des fonctions comme click() sur le chat
    cat.interactive = true;
    cat.click = function () {
        //    Whatever
    };

    // On ajoute notre chat à notre niveau
    stage.addChild(cat);


    /**
     * Menu
     */
    // On positionne les steps en haut et centré dans le menu
    steps.x = (steps.parent.width / 2) - (steps.width / 2);
    steps.y = 128;

    // Icones d'action
    forward = new PIXI.Sprite(
        PIXI.loader.resources['forward'].texture
    );
    forward.x = 0;

    turnleft = new PIXI.Sprite(
        PIXI.loader.resources['turnleft'].texture,
    );
    turnleft.x = 32;

    turnright = new PIXI.Sprite(
        PIXI.loader.resources['turnright'].texture
    );
    turnright.x = 64;

    wait = new PIXI.Sprite(
        PIXI.loader.resources['wait'].texture
    );
    wait.x = 96;

    actions.addChild(forward, turnleft, turnright, wait);

    // On positionne notre barre d'actions en bas et centré dans le menu
    actions.x = (actions.parent.width / 2) - (actions.width / 2);
    actions.y = actions.parent.height - 128;


    // Pour chacun des boutons d'action, on les rend interactif pour pouvoir les cliquer,
    // drag'n'drop, etc, et on associe ces events aux fonctions dans ./functions
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


    let mapText = new PIXI.Text('La map du jeu');
    mapText.x = 20;
    mapText.y = stage.height;
    stage.addChild(mapText);

    let menuText = new PIXI.Text('Le menu du jeu');
    menuText.x = 20;
    menuText.y = menu.height;
    menu.addChild(menuText);


    // On lance la fonction loop qui se répètera à chaque frame
    loop();
}


/**
 * loop: se répète à chaque frame
 */
function loop() {
    requestAnimationFrame(loop);

    // cat.x += 2;

    app.renderer.render(container);
}