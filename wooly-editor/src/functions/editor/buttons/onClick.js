// Cet event click concerne le clic sur les boutons dans l'interface de l'éditeur

module.exports = function () {
  let main = require('../../../main');
  let map = main.map;
  let menu = main.menu;
  let editor = main.editor;
  let grid = main.grid;
  let tileButtons = main.tileEditorArea;
  let objectButtons = main.objectEditorArea;
  let uiButtons = main.uiEditorArea;

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

  uiButtons.children.filter(ui => {
    if (ui.name !== this.name) {
      ui.highlight = false;
      ui.changeSprite(ui.name);
    }
  });

  if (this.name === 'editor-test' || this.name === 'editor-back') {
    menu.visible = !menu.visible;
    editor.visible = !editor.visible;
  }


  this.highlight = !this.highlight;

  if (this.highlight && this.name !== 'editor-test' && this.name !== 'editor-back') {
    this.changeSprite('editor-' + textureName + '-focus');
  } else {
    this.changeSprite('editor-' + textureName);
  }

};
