class PointerManager {
  constructor(options = {}) {
    const defaults = {
      debug: false,
      debugTarget: '#pointer-debug',
      target: '#app',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.firstTouch = false;
    this.$target = $(this.options.target);
    this.pointers = {};
    if (this.options.debug !== false) {
      this.debug = true;
      this.$debugTarget = $(this.options.debugTarget);
    }
    this.loadListeners();
  }

  getPointer(event) {
    const pointerId = this.constructor.getPointerId(event);

    let pointer;
    if (_.has(this.pointers, pointerId)) {
      pointer = this.pointers[pointerId];
    } else {
      pointer = new Pointer({ id: pointerId });
      this.pointers[pointerId] = pointer;
    }

    return pointer;
  }

  static getPointerId(event) {
    let { pointerId } = event;

    if (pointerId === undefined) pointerId = '0';
    else pointerId = String(pointerId);

    return pointerId;
  }

  loadListeners() {
    this.$target.on('pointerdown', (e) => this.onPointerStart(e));
    this.$target.on('pointerup pointercancel pointerout', (e) => this.onPointerEnd(e));
    this.$target.on('pointermove', (e) => this.onPointerMove(e));
  }

  log() {
    _.each(this.pointers, (pointer, pointerId) => {
      pointer.debug(this.$debugTarget);
    });
  }

  onPointerEnd(event) {
    const pointer = this.getPointer(event);
    pointer.onEnd(event);
  }

  onPointerMove(event) {
    const pointer = this.getPointer(event);
    pointer.onMove(event);
  }

  onPointerStart(event) {
    if (!this.firstTouch) this.firstTouch = true;
    const pointer = this.getPointer(event);
    pointer.onStart(event);
  }

  render(now) {
    if (this.debug === true && this.firstTouch) this.log();
  }

  update(now) {
    if (!this.firstTouch) return;
    _.each(this.pointers, (pointer, pointerId) => {
      pointer.update(now);
    });
  }
}
