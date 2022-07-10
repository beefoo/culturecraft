class Particle {
  constructor(options = {}) {
    const defaults = {
      action: 'drag',
      mainCtx: false,
      prevX: 0,
      prevY: 0,
      spriteCtx: false,
      textureManager: false,
      x: 0,
      y: 0,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.valid = false;
    this.isRemoved = false;
    if (this.options.mainCtx === false
      || this.options.spriteCtx === false
      || this.options.textureManager === false) return;

    this.mainCtx = this.options.mainCtx;
    this.spriteCtx = this.options.spriteCtx;
    this.texture = this.options.textureManager.currentTexture;
    this.x = this.options.x;
    this.y = this.options.y;
    this.prevX = this.options.prevX;
    this.prevY = this.options.prevY;
    this.radians = 0;

    if (this.x !== this.prevX || this.y !== this.prevY) {
      this.radians = MathUtil.radiansBetweenPoints(this.prevX, this.prevY, this.x, this.y);
    }

    this.valid = true;
    this.isDrawing = false;
  }

  remove() {
    this.isRemoved = true;
  }

  render() {
    if (this.isRemoved) return;

    const {
      mainCtx, texture, spriteCtx, x, y,
    } = this;
    if (!texture.isValid()) return;

    if (this.isDrawing) return;
    this.isDrawing = true;

    const textureImage = texture.loadedImage;
    const spriteW = spriteCtx.canvas.width;
    const spriteH = spriteCtx.canvas.height;
    const spriteHW = spriteW / 2;
    const spriteHH = spriteH / 2;
    const textureW = textureImage.width;
    const textureH = textureImage.height;
    const sampleW = Math.floor(spriteW / Math.SQRT2);
    const sampleH = Math.floor(spriteH / Math.SQRT2);

    if (sampleW > textureW || sampleH > textureH) {
      console.log('Texture image not large enough');
      return;
    }

    const sx = _.random(textureW - sampleW);
    const sy = _.random(textureH - sampleH);
    const dx = Math.round((spriteW - sampleW) / 2);
    const dy = Math.round((spriteH - sampleH) / 2);
    spriteCtx.restore();
    spriteCtx.clearRect(0, 0, spriteW, spriteH);
    spriteCtx.save();

    spriteCtx.translate(spriteHW, spriteHH);
    spriteCtx.rotate(this.radians);
    spriteCtx.translate(-spriteHW, -spriteHH);

    const mask = new Mask({
      activeH: sampleH,
      activeW: sampleW,
      height: spriteH,
      width: spriteW,
    });
    spriteCtx.clip(mask.path);
    spriteCtx.drawImage(textureImage, sx, sy, sampleW, sampleH, dx, dy, sampleW, sampleH);

    const drawX = x - spriteW / 2;
    const drawY = y - spriteH / 2;
    mainCtx.drawImage(spriteCtx.canvas, drawX, drawY, spriteW, spriteH);

    this.isDrawing = false;
  }
}
