class PointerManager {
  constructor(options = {}) {
    const defaults = {
      debug: false,
      debugTarget: '#pointer-debug',
      dragThreshold: 10, // move this distance before being considered a drag
      maxPointers: 24,
      pressThreshold: 250, // time it takes to go from tap to press
      target: '#app',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$target = $(this.options.target);
    this.pointers = {};
    if (this.options.debug) {
      this.loadDebug();
    }
    this.loadListeners();
  }

  getPointer(event) {
    let { pointerId } = event;

    if (pointerId === undefined) pointerId = '0';
    else pointerId = String(pointerId);

    let pointer;
    if (_.has(this.pointers, pointerId)) {
      pointer = this.pointers[pointerId];
    } else {
      pointer = new Pointer({ id: pointerId });
    }

    pointer.addEvent(event);

    return pointer;
  }

  loadDebug() {
    const $debug = $(this.options.debugTarget);
    const $debugPointers = [];
    _.times(this.options.maxPointers, (n) => {
      const $debugPointer = $(`<div id="debug-pointer-${n + 1}" class="debug-pointer"></div>`);
      $debug.append($debugPointer);
      $debugPointers.push($debugPointer);
    });
    this.$debugPointers = $debugPointers;
  }

  loadListeners() {
    const target = this.$target[0];

    target.addEventListener('pointerdown', (e) => this.onPointerStart(e), false);
    target.addEventListener('pointerup', (e) => this.onPointerEnd(e), false);
    target.addEventListener('pointercancel', (e) => this.onPointerEnd(e), false);
    target.addEventListener('pointermove', (e) => this.onPointerMove(e), false);
  }

  log(event) {
    if (!this.options.debug) return;

    const { isFirst, isFinal } = event;
    const { x, y } = event.center;
    const eventType = event.type;
    let { pointerId } = event.srcEvent;

    if (pointerId === undefined) pointerId = '0';
    else pointerId = String(pointerId);

    let pointerIndex = _.indexOf(this.pointerIds, pointerId);
    if (pointerIndex < 0) {
      this.pointerIds.push(pointerId);
      pointerIndex = this.pointerIds.length - 1;
    }
    if (pointerIndex >= this.options.maxPointers) return;

    const $debugPointer = this.$debugPointers[pointerIndex];

    $debugPointer.html(`<span class="pointer-id">${pointerId}</span><span class="event-type">${eventType}</span>`);
    $debugPointer.css('transform', `translate3d(${x}px, ${y}px, 0)`);
    $debugPointer.addClass('visible');
    if (isFinal) $debugPointer.removeClass('active');
    else $debugPointer.addClass('active');
  }

  onPointerEnd(event) {
    const pointer = this.getPointer(event);
  }

  onPointerMove(event) {
    const pointer = this.getPointer(event);
  }

  onPointerStart(event) {
    const pointer = this.getPointer(event);
  }
}
