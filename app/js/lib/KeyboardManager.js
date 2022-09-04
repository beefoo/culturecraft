class KeyboardManager {
  constructor(options = {}) {
    const defaults = {
      pointer: false,
      ptsPerSecond: 0.015,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$window = $(window);
    this.isActive = false;
    this.keys = {
      up: false, down: false, left: false, right: false,
    };
    this.position = { x: 0.5, y: 0.5 };
    this.vector = { x: 0, y: 0 };
    this.pointer = this.options.pointer;
    this.previousTime = false;
    this.onResize();
    this.loadListeners();
  }

  getPointerEvent(type) {
    const clientX = this.position.x * this.w;
    const clientY = this.position.y * this.h;
    const pointerEvent = {
      clientX,
      clientY,
      originalEvent: {
        isPrimary: true,
        pressure: 0.667,
      },
      pointerType: 'keyboard',
      type,
    };
    return pointerEvent;
  }

  loadListeners() {
    const $el = $(document);

    $el.on('keydown', (e) => this.onKeydown(e));
    $el.on('keyup', (e) => this.onKeyup(e));
  }

  onKeydown(event) {
    this.updateKeys(event.key, true);
    this.updateVector();
    this.update(Date.now());
  }

  onKeyup(event) {
    const now = Date.now();
    this.updateKeys(event.key, false);
    this.updateVector();
    if (!this.isActive) {
      const pointerEvent = this.getPointerEvent('pointerup');
      this.pointer.onEnd(pointerEvent);
      this.pointer.update(now);
    }
    this.update(now);
  }

  onResize() {
    this.w = this.$window.width();
    this.h = this.$window.height();
  }

  update(now) {
    if (!this.pointer) return;

    let pointerEvent;

    if (!this.isActive) {
      this.previousTime = false;
      return;
    }

    if (!this.previousTime) {
      this.previousTime = now;
      pointerEvent = this.getPointerEvent('pointerdown');
      this.pointer.onStart(pointerEvent);
      this.pointer.update(now);
      return;
    }

    const deltaSeconds = (now - this.previousTime) / 1000.0;
    const pts = this.options.ptsPerSecond * deltaSeconds;

    this.position.x += this.vector.x * pts;
    this.position.y += this.vector.y * pts;
    this.position.x = MathUtil.clamp(this.position.x, 0, 1);
    this.position.y = MathUtil.clamp(this.position.y, 0, 1);

    pointerEvent = this.getPointerEvent('pointermove');
    this.pointer.onMove(pointerEvent);
    this.pointer.update(now);
  }

  updateKeys(key, isActive) {
    if (key === 'w') this.keys.up = isActive;
    else if (key === 'a') this.keys.left = isActive;
    else if (key === 's') this.keys.down = isActive;
    else if (key === 'd') this.keys.right = isActive;
  }

  updateVector() {
    if (this.keys.up === this.keys.down) this.vector.y = 0;
    else if (this.keys.up) this.vector.y = -1;
    else this.vector.y = 1;
    if (this.keys.left === this.keys.right) this.vector.x = 0;
    else if (this.keys.right) this.vector.x = 1;
    else this.vector.x = -1;
    this.isActive = this.vector.x !== 0 || this.vector.y !== 0;
  }
}
