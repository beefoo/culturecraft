class Brush {
  constructor(options = {}) {
    const defaults = {
      action: 'drag',
      canvas: false,
      pointer: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.action = this.options.action;
    this.canvas = this.options.canvas;
    this.pointer = this.options.pointer;
    this.isRemoved = false;
    this.timeCreated = Date.now();
    this.x = this.pointer.x;
    this.y = this.pointer.y;
  }

  remove() {
    this.canvas = false;
    this.pointer = false;
    this.isRemoved = true;
  }

  render(now) {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const { action, canvas, pointer } = this;
    const { x, y } = pointer;
    const distance = MathUtil.distance(x, y, this.x, this.y);
    this.x = x;
    this.y = y;

    if (distance < 0.1 && this.action !== 'tap') return;

    canvas.debug(x, y);

    if (this.action === 'tap' || pointer.isEnded) this.remove();
  }
}
