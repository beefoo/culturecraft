class Brush {
  constructor(options = {}) {
    const defaults = {
      action: 'drag',
      canvas: false,
      debug: false,
      distanceThreshold: 10,
      pointer: false,
      spriteContainer: '#hidden-layer',
      spriteW: 512,
      spriteH: 512,
      textureManager: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.action = this.options.action;
    this.canvas = this.options.canvas;
    this.offsetX = this.canvas.offsetX;
    this.offsetY = this.canvas.offsetY;
    this.pointer = this.options.pointer;
    this.textureManager = this.options.textureManager;
    this.isRemoved = false;
    this.timeCreated = Date.now();
    this.prevX = this.pointer.x;
    this.prevY = this.pointer.y;
    this.hasDrawn = false;

    this.$spriteContainer = $(this.options.spriteContainer);
    const $spriteCanvas = $('<canvas></canvas>');
    const [spriteCanvas] = $spriteCanvas;
    spriteCanvas.width = this.options.spriteW;
    spriteCanvas.height = this.options.spriteH;
    this.spriteCanvas = spriteCanvas;
    this.$spriteContainer.append(this.spriteCanvas);
    this.spriteCtx = spriteCanvas.getContext('2d');
  }

  remove() {
    this.$spriteContainer[0].removeChild(this.spriteCanvas);
    this.canvas = false;
    this.pointer = false;
    this.isRemoved = true;
    this.hasDrawn = false;
  }

  render(now) {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const {
      action, canvas, pointer, spriteCtx, textureManager,
    } = this;
    const {
      offsetX, offsetY, prevX, prevY,
    } = this;
    const { x, y } = pointer;
    const distance = MathUtil.distance(x, y, prevX, prevY);

    if (distance < this.options.distanceThreshold && action === 'drag' && !(distance > 0 && !this.hasDrawn)) {
      if (pointer.isEnded) this.remove();
      return;
    }

    if (this.options.debug) canvas.debug(x, y);
    else {
      const particle = new Particle({
        action,
        distanceMin: this.options.distanceThreshold,
        mainCtx: canvas.ctx,
        prevX: prevX + offsetX,
        prevY: prevY + offsetY,
        spriteCtx,
        textureManager,
        x: x + offsetX,
        y: y + offsetY,
      });
      particle.render();
      this.prevX = x;
      this.prevY = y;
    }
    this.hasDrawn = true;

    if (action === 'tap' || pointer.isEnded) this.remove();
  }
}
