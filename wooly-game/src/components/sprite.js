let Tooltip = require('./tooltip');

class Sprite extends PIXI.Sprite {


  constructor(texture = null, name = '', originX = 0, originY = 0, onStep = false, currentStep = null, hasTooltip = false, tooltip = '') {
    super(PIXI.loader.resources[texture].texture);
    this._name = name;
    this._originX = originX;
    this._originY = originY;
    this._onStep = onStep;
    this._currentStep = currentStep;
    this._hasTooltip = hasTooltip;
    this._tooltip = new Tooltip('tooltip', 'tooltip', tooltip);
    this._tooltip.alpha = 0;
  }

  changeSprite(sprite) {
    this.texture = PIXI.Texture.from(sprite);
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get originY() {
    return this._originY;
  }

  set originY(value) {
    this._originY = value;
  }
  get originX() {
    return this._originX;
  }

  set originX(value) {
    this._originX = value;
  }

  get onStep() {
    return this._onStep;
  }

  set onStep(value) {
    this._onStep = value;
  }

  get currentStep() {
    return this._currentStep;
  }

  set currentStep(value) {
    this._currentStep = value;
  }

  get hasTooltip() {
    return this._hasTooltip;
  }

  set hasTooltip(value) {
    this._hasTooltip = value;
  }

  get tooltip() {
    return this._tooltip;
  }

  set tooltip(value) {
    this._tooltip = new Tooltip('tooltip', 'tooltip', value);
  }
}

module.exports = Sprite;
