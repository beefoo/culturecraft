class Particle {
  constructor(options = {}) {
    const defaults = {
      mainCtx: false,
      spriteCtx: false,
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
    if (this.options.mainCtx === false
      || this.options.spriteCtx === false
      || this.options.texture === false) return;

    this.mainCtx = this.options.mainCtx;
    this.spriteCtx = this.options.spriteCtx;
    this.texture = this.options.texture;
    this.x = this.options.x;
    this.y = this.options.y;

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

    const textureImage = texture.loadedTexture;
    const spriteW = spriteCtx.canvas.width;
    const spriteH = spriteCtx.canvas.height;
    const spriteHW = spriteW / 2;
    const spriteHH = spriteH / 2;
    const textureW = textureImage.width;
    const textureH = textureImage.height;
    const sampleW = spriteW / 2;
    const sampleH = spriteH / 2;

    if (sampleW > textureW || sampleH > textureH) {
      console.log('Texture image not large enough');
      return;
    }

    const sx = _.random(textureW - sampleW);
    const sy = _.random(textureH - sampleH);
    const dx = Math.round((spriteW - sampleW) / 2);
    const dy = Math.round((spriteH - sampleH) / 2);
    const degrees = Math.random() * 360;
    spriteCtx.restore();
    spriteCtx.clearRect(0, 0, spriteW, spriteH);
    spriteCtx.save();

    spriteCtx.translate(spriteHW, spriteHH);
    spriteCtx.rotate(degrees * (Math.PI / 180));
    spriteCtx.translate(-spriteHW, -spriteHH);

    const mx1 = spriteW / 2;
    const my1 = dy;
    const mx2 = dx + sampleW;
    const my2 = dy + sampleH;
    const mx3 = dx;
    const my3 = dy + sampleH;
    const mx4 = dx;
    const my4 = dy;
    const mx5 = mx4 + sampleW / 4;
    const my5 = dy;
    const mx6 = dx;
    const my6 = dy + sampleH / 4;
    const mask = new Path2D();
    mask.moveTo(mx1, my1);
    mask.lineTo(mx2, my2);
    mask.lineTo(mx3, my3);
    mask.lineTo(mx1, my1);
    mask.moveTo(mx4, my4);
    mask.lineTo(mx5, my5);
    mask.lineTo(mx6, my6);
    mask.lineTo(mx4, my4);
    spriteCtx.clip(mask);
    spriteCtx.drawImage(textureImage, sx, sy, sampleW, sampleH, dx, dy, sampleW, sampleH);

    const drawX = x - spriteW / 2;
    const drawY = y - spriteH / 2;
    mainCtx.drawImage(spriteCtx.canvas, drawX, drawY, spriteW, spriteH);

    this.isDrawing = false;
  }
}
