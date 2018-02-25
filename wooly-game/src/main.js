import Vue from 'vue'
import App from './App.vue'

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
    // transparent: true
    backgroundColor: 0xffffff
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

// Dessine la grille sur la map
let grid = new Grid(20, 14, 32, 32, stage);
grid.draw();

// Barre des actions possibles (dans le menu en bas)
let actions = new PIXI.Container();
menu.addChild(actions);

// Chargement des sprites/images
PIXI.loader
    .add("cat", "./src/assets/images/a-cat.svg")
    .add("forward", "./src/assets/images/forward.png")
    .add("turnleft", "./src/assets/images/turnleft.png")
    .add("turnright", "./src/assets/images/turnright.png")
    .add("wait", "./src/assets/images/wait.png")
    .load(setup);

let cat;
let forward;
let turnleft;
let turnright;
let wait;

function onDragStart(event) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd() {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
}

function onDragMove() {
    if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
}


/**
 * setup: au chargement de la page / du niveau
 */
function setup() {
    // On crée notre chat à partir du sprite
    cat = new PIXI.Sprite(
        PIXI.loader.resources['cat'].texture
    );

    // cat.scale.set(0.1, 0.1);

    // Icones d'action
    forward = new PIXI.Sprite(
        PIXI.loader.resources['forward'].texture
    );
    forward.x = 0;
    forward.interactive = true;
    forward.buttonMode = true;

    turnleft = new PIXI.Sprite(
        PIXI.loader.resources['turnleft'].texture,
    );
    turnleft.x = 32;
    turnleft.interactive = true;
    turnleft.buttonMode = true;

    turnright = new PIXI.Sprite(
        PIXI.loader.resources['turnright'].texture
    );
    turnright.x = 64;
    turnright.interactive = true;
    turnright.buttonMode = true;

    wait = new PIXI.Sprite(
        PIXI.loader.resources['wait'].texture
    );
    wait.x = 96;
    wait.interactive = true;
    wait.buttonMode = true;

    actions.addChild(forward, turnleft, turnright, wait);

    actions.x = (actions.parent.width / 2) - (actions.width / 2);
    actions.y = actions.parent.height - 128;

    for (let action of actions.children) {
        action
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
    }


    // Définit le point d'origine du sprite (avec 0.5 => au milieu)
    // cat.anchor.set(0.5, 0.5);
    cat.x = 0;
    cat.y = 0;

    // For mouse-only events

    let mapText = new PIXI.Text('La map du jeu');
    mapText.x = 20;
    mapText.y = stage.height;
    stage.addChild(mapText);

    let menuText = new PIXI.Text('Le menu du jeu');
    menuText.x = 20;
    menuText.y = menu.height;
    menu.addChild(menuText);

    // On le rend "interactif" pour pouvoir utiliser des fonctions comme click() sur le chat
    cat.interactive = true;

    cat.click = function () {
    //    Whatever
    };

    // On ajoute notre chat à notre niveau
    stage.addChild(cat);

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