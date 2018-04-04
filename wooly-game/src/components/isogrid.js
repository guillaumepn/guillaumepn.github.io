const MapTile = require('./maptile');
const map = require('../assets/maps/map01');
const _ = require('lodash');


class IsoGrid {

  constructor(horizontalTiles, verticalTiles, tileWidth, tileHeight, container, textures) {
    this.horizontalTiles = horizontalTiles;
    this.verticalTiles = verticalTiles;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.container = container;
    this.textures = textures;
  }

  draw() {
    let floorTexture = undefined;
    let cnt = 0;
    let tilesLine = 1;
    let x = 336;
    let initialX = x;
    let y = 96;
    let tileId = 1;

    // Dessine la partie supérieure de la map
    while (tilesLine <= 9) {
      for (cnt = 0; cnt < tilesLine; cnt++) {
        let infos = {
          id: tileId,
          x: x,
          y: y
        };

        let floor = undefined;

        floorTexture = PIXI.Texture.fromImage('./src/assets/images/' + map.tiles[tileId].firstLayer + '.png');
        floor = new MapTile(floorTexture, tileId, x, y, infos);

        this.container.addChild(floor);
        x += 64;
        tileId++;
      }

      x = initialX - 32;
      initialX = x;
      y += 16;
      tilesLine++;
    }

    tilesLine--;

    // Dessine la partie inférieure de la map
    while (tilesLine >= 1) {
      for (cnt = 0; cnt < tilesLine; cnt++) {
        let infos = {
          id: tileId,
          x: x,
          y: y
        };

        floorTexture = PIXI.Texture.fromImage('./src/assets/images/' + map.tiles[tileId].firstLayer + '.png');
        floor = new MapTile(floorTexture, tileId, x, y, infos);

        this.container.addChild(floor);
        x += 64;
        tileId++;
      }

      x = initialX + 32;
      initialX = x;
      y += 16;
      tilesLine--;
    }

    console.log(Math.random().toString(36).substr(2, 9));
    // console.log(map.tiles["1"].firstLayer); // => "grass", "water"...
    // console.log(this.container.children[5].constructor.name); // => "MapTile"
    // console.log(this.container.children.filter(child => child.constructor.name === 'MapTile')); // Afficher que les MapTiles

  }

  getWidth() {
    return this.horizontalTiles * this.tileWidth;
  }

  getHeight() {
    return this.verticalTiles * this.tileHeight;
  }
}

module.exports = IsoGrid;
