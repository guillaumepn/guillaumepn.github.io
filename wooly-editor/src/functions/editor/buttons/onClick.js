// Cet event click concerne le clic sur les boutons dans l'interface de l'éditeur

module.exports = function () {
  let main = require('../../../main');
  let map = main.map;
  let grid = main.grid;
  let tileButtons = main.tileEditorArea;
  let objectButtons = main.objectEditorArea;

  let textureName = this.name.replace('editor-', '');

  tileButtons.children.filter(tile => {
    if (tile.name !== this.name) {
      tile.highlight = false;
      tile.changeSprite(tile.name);
    }
  });

  objectButtons.children.filter(object => {
    if (object.name !== this.name) {
      object.highlight = false;
      object.changeSprite(object.name);
    }
  });

  this.highlight = !this.highlight;

  if (this.highlight) {
    this.changeSprite('editor-' + textureName + '-focus');
  } else {
    this.changeSprite('editor-' + textureName);
  }

};
