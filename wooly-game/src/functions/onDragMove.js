let main = require('../main');
let steps = main.steps;

module.exports = function onDragMove() {
    if (this.dragging) {
        for (let step of steps.children) {
            if (step.getBounds().contains(this.data.global.x, this.data.global.y)) {
                console.log("ça rentre!");
                step.tint = 0x00ff00;
            } else {
                step.tint = 0xffffff;
            }
        }
        let newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
    }
};