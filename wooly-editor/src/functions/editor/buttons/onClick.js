module.exports = function () {
  let main = require('../../../main');
  let map = main.map;
  let grid = main.grid;

  switch (this.name) {
    case 'editor-grass':
      map.tiles[this.editorId].firstLayer.texture = 'grass';
      // grid.container.children[this.editorId].changeTexture('grass');
      grid.container.children[this.editorId].texture = PIXI.loader.resources['grass'].texture;
      break;

    case 'editor-water':
      map.tiles[this.editorId].firstLayer.texture = 'water';
      console.log(grid.container.children[this.editorId]);
      // grid.container.children[this.editorId].changeTexture('water');
      grid.container.children[this.editorId].texture = PIXI.loader.resources['water'].texture;
      break;
    default: break;
  }

  console.log(grid);
  console.log(this.editorId);
};
