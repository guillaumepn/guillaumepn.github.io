class Button extends PIXI.Sprite {
    constructor(texture) {
        super(PIXI.loader.resources[texture].texture);
    }
}

module.exports = Button;