class Brush {
  constructor(options = {}) {
    const defaults = {
      action: 'drag',
      canvas: false,
      debug: false,
      distanceThreshold: 10,
      pointer: false,
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
    this.pointer = this.options.pointer;
    this.textureManager = this.options.textureManager;
    this.isRemoved = false;
    this.timeCreated = Date.now();
    this.prevX = this.pointer.x;
    this.prevY = this.pointer.y;

    this.$spriteContainer = $('#hidden-layer');
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
  }

  render(now) {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const {
      action, canvas, pointer, spriteCtx, textureManager,
    } = this;
    const { prevX, prevY } = this;
    const { x, y } = pointer;
    const distance = MathUtil.distance(x, y, prevX, prevY);

    if (distance < this.options.distanceThreshold && action === 'drag') {
      if (pointer.isEnded) this.remove();
      return;
    }

    if (this.options.debug) canvas.debug(x, y);
    else {
      const particle = new Particle({
        action,
        mainCtx: canvas.ctx,
        prevX,
        prevY,
        spriteCtx,
        textureManager,
        x,
        y,
      });
      particle.render();
      this.prevX = x;
      this.prevY = y;
    }

    if (action === 'tap' || pointer.isEnded) this.remove();
  }
}
