class PointerManager {
  constructor(options = {}) {
    const defaults = {
      debug: false,
      debugTarget: '#pointer-debug',
      dragThreshold: 10, // move this distance before being considered a drag
      pressThreshold: 250, // time it takes to go from tap to press
      target: '#app',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$target = $(this.options.target);
    this.pointers = {};
    if (this.options.debug !== false) {
      this.debug = true;
      this.$debugTarget = $(this.options.debugTarget);
    }
    this.loadListeners();
  }

  getPointer(event, mustExist = false) {
    const pointerId = this.constructor.getPointerId(event);

    let pointer;
    if (_.has(this.pointers, pointerId)) {
      pointer = this.pointers[pointerId];
    } else if (mustExist) {
      return false;
    } else {
      pointer = new Pointer({ id: pointerId });
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
    const target = this.$target[0];

    target.addEventListener('pointerdown', (e) => this.onPointerStart(e), false);
    target.addEventListener('pointerup', (e) => this.onPointerEnd(e), false);
    target.addEventListener('pointercancel', (e) => this.onPointerEnd(e), false);
    target.addEventListener('pointermove', (e) => this.onPointerMove(e), false);
  }

  log() {
    _.each(this.pointers, (pointer, pointerId) => {
      pointer.debug(this.$debugTarget);
    });
  }

  onPointerEnd(event) {
    const pointer = this.getPointer(event);
    pointer.addEvent(event);
  }

  onPointerMove(event) {
    const pointer = this.getPointer(event, mustExist = true);
    if (pointer === false) return;
    pointer.addEvent(event);
  }

  onPointerStart(event) {
    const pointer = this.getPointer(event);
    pointer.addEvent(event);
  }

  render() {
    if (this.debug === true) log();
  }

  update() {
    const t = Date.now() / 1000.0;
    _.each(this.pointers, (pointer, pointerId) => {
      pointer.update(t);
    });
  }
}
