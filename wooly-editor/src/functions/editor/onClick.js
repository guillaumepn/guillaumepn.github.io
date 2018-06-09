
module.exports = function () {
  const onHover = require('../onHover');
  const onOut = require('../onOut');
  const onClick = require('./buttons/onClick');

  const Sprite = require('../../components/sprite');
  let main = require('../../main');
  let tooltips = main.tooltips;
  let editor = main.editor;

  let tiles = editor.children[0];
  tiles.removeChildren();
  let objects = editor.children[1];
  objects.removeChildren();

  let grass = new Sprite('editor-grass', 'editor-grass', 0);
  grass.editorId = this.infos.id;
  grass.x = 0;
  grass.originX = 0;
  grass.hasTooltip = true;
  grass.tooltip = 'Herbe';
  tooltips.addChild(grass.tooltip);

  let water = new Sprite('editor-water', 'editor-water', 32);
  water.editorId = this.infos.id;
  water.x = 32;
  water.originX = 32;
  water.hasTooltip = true;
  water.tooltip = 'Eau';
  tooltips.addChild(water.tooltip);

  tiles.addChild(grass);
  tiles.addChild(water);

  for (let tile of tiles.children) {
    tile.interactive = true;
    tile.buttonMode = true;
    tile.anchor.set(0.5, 0.5);
    tile
      .on('pointerover', onHover)
      .on('pointerout', onOut)
      .on('click', onClick);
  }

  for (let object of objects.children) {
    object.interactive = true;
    object.buttonMode = true;
    object.anchor.set(0.5, 0.5);
    object
      .on('pointerover', onHover)
      .on('pointerout', onOut)
      .on('click', onClick);
  }

  console.log(tooltips);
  console.log(this.infos);
};
