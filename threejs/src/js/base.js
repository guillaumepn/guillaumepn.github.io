// styles
import '../scss/index.scss';

// three.js
import * as THREE from 'three';

let loader = new THREE.TextureLoader();
let grassSide = loader.load('./img/grass-side.jpg');
let grassTop = loader.load('./img/grass-top.png');
let grassBottom = loader.load('./img/grass-bottom.jpg');

let grassMaterials = [
    new THREE.MeshLambertMaterial({
        map: grassSide
    }),
    new THREE.MeshLambertMaterial({
        map: grassSide
    }),
    new THREE.MeshLambertMaterial({
        map: grassTop
    }),
    new THREE.MeshLambertMaterial({
        map: grassBottom
    }),
    new THREE.MeshLambertMaterial({
        map: grassSide
    }),
    new THREE.MeshLambertMaterial({
        map: grassSide
    })
];

let renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#canvas'), antialias: true });
renderer.setClearColor(0x00ff00);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 3000);

let scene = new THREE.Scene();

let light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

let light1 = new THREE.PointLight(0xffffff, 0.5);
scene.add(light1);


let geometry = new THREE.BoxGeometry(100, 100, 100);

let material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    map: grassTop
});
let mesh = new THREE.Mesh(geometry, grassMaterials);
mesh.position.set(0 , 0, -1000);

scene.add(mesh);


render();

function render() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}