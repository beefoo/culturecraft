class Particle {
  constructor(options = {}) {
    const defaults = {
      action: 'drag',
      distanceMin: 10,
      distanceMax: 40,
      mainCtx: false,
      minScale: 0.25,
      pressure: 0.5,
      prevX: 0,
      prevY: 0,
      scatter: 0,
      scatterMin: 0,
      scatterMax: 100,
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
    this.radians = 0;
    const { prevX, prevY } = this.options;
    let distance = 0;

    if (this.x !== prevX || this.y !== prevY) {
      distance = MathUtil.distance(prevX, prevY, this.x, this.y);
      this.radians = MathUtil.radiansBetweenPoints(prevX, prevY, this.x, this.y);
    }

    const { distanceMin, distanceMax } = this.options;
    this.magnitude = MathUtil.norm(distance, distanceMin, distanceMax);
    this.magnitude = MathUtil.clamp(this.magnitude, 0, 1);

    const { pressure } = this.options;
    if (pressure > 0.5) this.magnitude = Math.max(this.magnitude, pressure);
    else if (pressure < 0.5) this.magnitude = Math.min(this.magnitude, pressure);

    if (this.options.action === 'tap') {
      this.magnitude = 0.5;
      this.radians = MathUtil.lerp(-Math.PI, Math.PI, Math.random());
    }

    if (this.options.scatter > 0) {
      const nscatter = this.options.scatter * this.magnitude;
      const scatter = MathUtil.lerp(this.options.scatterMin, this.options.scatterMax, nscatter);
      const scatterX = scatter * MathUtil.lerp(-1, 1, Math.random());
      const scatterY = scatter * MathUtil.lerp(-1, 1, Math.random());
      this.x += scatterX;
      this.y += scatterY;
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
    const scale = MathUtil.lerp(this.options.minScale, 1, this.magnitude);

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
      shapeCount: _.random(1, 3),
      width: spriteW,
    });
    spriteCtx.clip(mask.path);
    spriteCtx.drawImage(textureImage, sx, sy, sampleW, sampleH, dx, dy, sampleW, sampleH);

    const scaledSpriteW = Math.round(spriteW * scale);
    const scaledSpriteH = Math.round(spriteH * scale);
    const drawX = x - scaledSpriteW / 2;
    const drawY = y - scaledSpriteH / 2;
    mainCtx.drawImage(spriteCtx.canvas, drawX, drawY, scaledSpriteW, scaledSpriteH);

    this.isDrawing = false;
  }
}
