import Vue from 'vue'
import App from './App.vue'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })

/**
 * Game code (with Pixi.js as 2D WebGL Renderer)
 */
require('./assets/scss/app.scss');
require('pixi.js');

PIXI.utils.sayHello();

let renderer = PIXI.autoDetectRenderer(640, 480, {
    transparent: true,
    resolution: 1,
});

document.getElementById('app').appendChild(renderer.view);

let stage = new PIXI.Container();

PIXI.loader
    .add("cat", "../src/assets/images/cat-sprite.png")
    .load(setup);

let cat;
let avance = true;

function setup() {
    cat = new PIXI.Sprite(
        PIXI.loader.resources['cat'].texture
    );

    cat.anchor.set(0.5, 0.5);
    cat.x = 0;
    cat.y = 64;

    cat.interactive = true;
    cat.click = function () {
        avance = !avance;
    };

    console.log(cat.x);

    stage.addChild(cat);

    loop();
}

function loop() {
    requestAnimationFrame(loop);
    if (cat.x > renderer.width) cat.x = 0;
    if (cat.x < 0) cat.x = renderer.width;
    if (avance) cat.x += 2;
    else cat.x -= 2;
    cat.rotation += 0.01;
    renderer.render(stage);
}