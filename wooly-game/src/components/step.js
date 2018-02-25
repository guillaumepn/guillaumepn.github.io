class Step {
    constructor(x, y, width, height, type, container) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.container = container;
    }

    draw() {
        let step = new PIXI.Graphics();
        step.beginFill(0xffffff);
        step.lineStyle(1, 0x000000, 0.2);
        step.drawRect(this.x, this.y, this.width, this.height);
        this.container.addChild(step);
    }
}

module.exports = Step;