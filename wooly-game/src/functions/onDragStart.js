const Sprite = require('../components/sprite');

let main = require('../main');
let actions = main.actions;
let checkActions = main.checkActions;

module.exports = function onDragStart(event) {
  // Crée une copie de l'action qu'on déplace,
  // pour qu'on puisse en ajouter autant qu'on veut
  let duplicate = new Sprite(this.name, this.name, this.originX, this.originY);
  duplicate.x = this.originX;
  actions.addChild(duplicate);
  duplicate.interactive = true;
  duplicate.buttonMode = true;
  duplicate.anchor.set(0.5, 0.5);
  checkActions();
  this.data = event.data;
  this.alpha = 0.8;
  this.dragging = true;
  this.anchor.set(0.5);
};
