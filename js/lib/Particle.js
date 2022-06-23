class Particle {
  constructor(options = {}) {
    const defaults = {
      parent: false,
      texture: false,
      x: 0,
      y: 0,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.valid = false;
    this.isRemoved = false;
    if (this.options.parent === false || this.options.texture === false) return;

    this.parent = this.options.parent;
    this.texture = this.options.texture;
    this.x = this.options.x;
    this.y = this.options.y;
    this.valid = true;
  }

  remove() {
    this.isRemoved = true;
  }

  render() {
    if (this.isRemoved) return;

    const {
      parent, texture, x, y,
    } = this;
    if (!texture.isValid()) return;

    const textureW = 1024;
    const textureH = 1024;
    const w = 20;
    const h = 40;
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    const container = new PIXI.Container();
    const sprite = PIXI.TilingSprite.from(texture.loadedTexture, { width: w, height: h });
    const mask = new PIXI.Graphics();
    sprite.tileTransform.position.set(-textureW + w * 0.5, -textureH + h * 0.5);
    mask.beginFill(0xffffff);
    mask.drawEllipse(w * 0.5, h * 0.5, w * 0.5, h * 0.5);
    mask.endFill();
    container.addChild(sprite, mask);
    container.mask = mask;
    container.pivot.set(w * 0.5, h * 0.5);
    container.rotation = Math.PI * Math.random();
    container.position.set(cx, cy);
    parent.addChild(container);
  }
}
