const MapTile = require('./maptile');

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
    let floorTexture = PIXI.Texture.fromImage('./src/assets/images/' + this.textures.floor + '.png');
    let cnt = 0;
    let tilesLine = 1;
    let x = 336;
    let initialX = x;
    let y = 96;
    let tileId = 0;

    while (tilesLine <= 9) {
      for (cnt = 0; cnt < tilesLine; cnt++) {
        let infos = {
          id: tileId,
          x: x,
          y: y
        };
        let floor = new MapTile(floorTexture, tileId, x, y, infos);
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

    while (tilesLine >= 1) {
      for (cnt = 0; cnt < tilesLine; cnt++) {
        let infos = {
          id: tileId,
          x: x,
          y: y
        };
        let floor = new MapTile(floorTexture, tileId, x, y, infos);
        this.container.addChild(floor);
        x += 64;
        tileId++;
      }

      x = initialX + 32;
      initialX = x;
      y += 16;
      tilesLine--;
    }

    // console.log(this.container.children[78].infos);
  }

  getWidth() {
    return this.horizontalTiles * this.tileWidth;
  }

  getHeight() {
    return this.verticalTiles * this.tileHeight;
  }
}

module.exports = IsoGrid;
