let main = require('../main');
let steps = main.steps;
let stepsObject = main.stepsObject;
let stepsArea = main.stepsArea;
let actions = main.actions;

module.exports = function onDragEnd() {
  let onStep = false;
  let theStep;
  let theIndex;
  let previousStep;

  for (let [index, step] of steps.children.entries()) {
    let point = this.data.global;
    // Si on est au-dessus d'une case vide, on met l'action dessus
    if (step.getBounds().contains(point.x, point.y)) {
      console.log(point);
      if (stepsObject[index].type === 'empty' && (step.tint).toString(16) === 'ff00') {
        theStep = step;
        theIndex = index;
        onStep = true;
        break;
      }
    }
  }

  if (this.onStep) {
    previousStep = this.currentStep;
    stepsObject[previousStep].type = 'empty';
  }

  if (onStep) {
    this.setParent(stepsArea);
    this.anchor.set(0);
    stepsObject[theIndex].type = this.name;
    theStep.tint = 0xffffff;
    this.x = theStep.getLocalBounds().x;
    this.y = theStep.getLocalBounds().y;
    this.onStep = true;
    this.currentStep = theIndex;
  } else {
    this.setParent(actions);
    this.anchor.set(0.5);
    this.x = this.originX;
    this.y = this.originY;
    this.onStep = false;
  }

  this.alpha = 1;
  this.dragging = false;
  this.data = null;
};
