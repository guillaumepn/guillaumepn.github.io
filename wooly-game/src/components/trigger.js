class Trigger extends PIXI.Sprite {

  constructor(originX, originY, type, container, texture) {
    super();

    this._originX = originX;
    this._originY = originY;
    this.x = originX;
    this.y = originY;
    this._type = type;
    this._container = container;
    this._texture = texture;

    this._container.addChild(this);
  }

  /**
   * Getters & setters
   */
  get originX() {
    return this._originX;
  }

  set originX(value) {
    this._originX = value;
  }

  get originY() {
    return this._originY;
  }

  set originY(value) {
    this._originY = value;
  }

  get type() {
    return this._type;
  }

  set type(newType) {
    this._type = newType;
  }

  get container() {
    return this._container;
  }

  set container(value) {
    this._container = value;
  }

  get texture() {
    return this._texture;
  }

  set texture(value) {
    this._texture = value;
  }

}

module.exports = Trigger;
