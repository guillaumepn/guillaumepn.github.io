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
 * @TODO Grid: dessine la grille des cases de la map
 * @type {Grid}
 */
const Grid = require('./components/grid');

let grid = new Grid(15, 10, 32, 32);
grid.draw();

// Affiche la version de Pixijs dans la console du navigateur
PIXI.utils.sayHello();

// Dimensions du canvas du jeu
let renderer = PIXI.autoDetectRenderer(640, 480, {
    transparent: true,
    resolution: 1,
});

// Ajouter le <canvas> du jeu dans la <div id='app'>
document.getElementById('app').appendChild(renderer.view);

// Création du container du niveau
let stage = new PIXI.Container();

// Chargement des sprites/images
PIXI.loader
    .add("cat", "./src/assets/images/cat-sprite.png")
    .load(setup);

let cat;

/**
 * setup: au chargement de la page / du niveau
 */
function setup() {
    // On crée notre chat à partir du sprite
    cat = new PIXI.Sprite(
        PIXI.loader.resources['cat'].texture
    );

    // Définit le point d'origine du sprite (avec 0.5 => au milieu)
    // cat.anchor.set(0.5, 0.5);
    cat.x = 64;
    cat.y = 64;

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

    cat.rotation += 0.1;

    renderer.render(stage);
}