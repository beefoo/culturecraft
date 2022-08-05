class PointerManager {
  constructor(options = {}) {
    const defaults = {
      debug: false,
      debugTarget: '#pointer-debug',
      onDrag: (pointer) => {},
      onDragEnd: (pointer) => {},
      onDragStart: (pointer) => {},
      onTap: (pointer) => {},
      target: '#touchable',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.firstTouch = false;
    this.$target = $(this.options.target);
    [this.target] = this.$target;
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
      const options = {
        id: pointerId,
        onDrag: this.options.onDrag,
        onDragEnd: this.options.onDragEnd,
        onDragStart: this.options.onDragStart,
        onTap: this.options.onTap,
      };
      pointer = new Pointer(options);
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

  isPointersActive() {
    return _.find(this.pointers, (pointer) => pointer.isActive);
  }

  loadListeners() {
    this.$target.on('pointerdown', (e) => this.onPointerStart(e));
    this.$target.on('pointerup', (e) => this.onPointerEnd(e));
    this.$target.on('pointermove', (e) => this.onPointerMove(e));
  }

  log() {
    _.each(this.pointers, (pointer, pointerId) => {
      pointer.debug(this.$debugTarget);
    });
  }

  onAllPointersEnd() {
    this.$target.removeClass('active');
  }

  onPointerEnd(event) {
    const pointer = this.getPointer(event);
    pointer.onEnd(event);
    if (!this.isPointersActive()) this.onAllPointersEnd();
  }

  onPointerMove(event) {
    const pointer = this.getPointer(event);
    pointer.onMove(event);
  }

  onPointerStart(event) {
    if (!this.firstTouch) this.firstTouch = true;
    this.$target.addClass('active');
    this.target.setPointerCapture(event.pointerId);
    const pointer = this.getPointer(event);
    pointer.onStart(event);
  }

  render(now) {
    if (this.debug === true && this.firstTouch) this.log();
  }

  update(now) {
    if (!this.firstTouch) return;
    const pointersToRemove = [];

    _.each(this.pointers, (pointer, pointerId) => {
      pointer.update(now);
      if (pointer.isRemoved) pointersToRemove.push(pointerId);
    });

    if (pointersToRemove.length > 0) {
      this.pointers = _.omit(this.pointers, pointersToRemove);
    }
  }
}
