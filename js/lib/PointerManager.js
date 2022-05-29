class PointerManager {
  constructor(options = {}) {
    const defaults = {
      debug: false,
      debugTarget: '#pointer-debug',
      maxPointers: 24,
      target: '#app',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$target = $(this.options.target);
    this.pointerIds = [];
    if (this.options.debug) {
      this.loadDebug();
    }
    this.loadListeners();
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
    const hammer = new Hammer(this.$target[0]);

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
    });
    hammer.on('pan', (e) => {
      this.onDrag(e);
    });
    hammer.on('press pressup', (e) => {
      this.onPress(e);
    });
    hammer.on('tap', (e) => {
      this.onTap(e);
    });
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

  onDrag(event) {
    this.log(event);
  }

  onPress(event) {
    this.log(event);
  }

  onTap(event) {
    this.log(event);
  }
}
