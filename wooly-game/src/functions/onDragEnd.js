let main = require('../main');
let steps = main.steps;

module.exports = function onDragEnd() {
    for (let step of steps.children) {
        if ((step.tint).toString(16) === 'ff00') {
            // console.log(step.getBounds());
            // console.log(step.getLocalBounds());
            this.setParent(steps);
            this.anchor.set(0);
            this.x = step.getLocalBounds().x;
            this.y = step.getLocalBounds().y;
            // console.log(step.getBounds());
            console.log(`${step.x} et ${step.y}`);
            step.tint = 0xffffff;
        }
    }
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
};