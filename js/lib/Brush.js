class Brush {
  constructor(options = {}) {
    const defaults = {
      action: 'drag',
      canvas: false,
      debug: false,
      pointer: false,
      texture: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.action = this.options.action;
    this.canvas = this.options.canvas;
    this.pointer = this.options.pointer;
    this.texture = this.options.texture;
    this.isRemoved = false;
    this.timeCreated = Date.now();
    this.x = this.pointer.x;
    this.y = this.pointer.y;
    this.container = new PIXI.Container();
    this.particles = [];
    this.canvas.addChild(this.container);
  }

  remove() {
    this.canvas = false;
    this.pointer = false;
    this.isRemoved = true;
    _.each(this.particles, (particle) => particle.remove());
  }

  render(now) {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const {
      action, canvas, pointer, texture,
    } = this;
    const { x, y } = pointer;
    const distance = MathUtil.distance(x, y, this.x, this.y);
    this.x = x;
    this.y = y;

    if (distance < 0.1 && this.action === 'drag') {
      if (pointer.isEnded) this.remove();
      return;
    }

    if (this.options.debug) canvas.debug(x, y);
    else {
      const particle = new Particle({
        parent: this.container,
        texture: this.texture,
        x,
        y,
      });
      particle.render();
      this.particles.push(particle);
    }

    if (this.action === 'tap' || pointer.isEnded) this.remove();
  }
}
