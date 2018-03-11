let main = require('../main');
let steps = main.steps;
let stepsObject = main.stepsObject;

module.exports = function onDragMove() {
    if (this.dragging) {
        for (let [index, step] of steps.children.entries()) {
            if (stepsObject[index].type === 'empty') {
                if (step.getBounds().contains(this.data.global.x, this.data.global.y)) {
                    step.tint = 0x00ff00;
                } else {
                    step.tint = 0xffffff;
                }
            }
        }
        let newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
};