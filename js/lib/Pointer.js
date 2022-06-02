class Pointer {
  constructor(options = {}) {
    const defaults = {
      id: '0',
      tapTimeThreshold: 250, // time it takes to go from tap to press/drag
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.id = this.options.id;

    this.isStarted = false;
    this.isEnded = false;
    this.isFirst = false;
    this.firstEvent = false;
    this.previousEvent = false;
    this.currentEvent = false;
    this.finalEvent = false;
    this.isFinal = false;
    this.isRemoved = false;
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    this.type = 'none';
    this.$debug = false;
  }

  addEvent(event) {
    // console.log(event);
    const pointerEvent = _.pick(event, 'clientX', 'clientY', 'isPrimary', 'pointerType', 'type');
    pointerEvent.time = Date.now();
    if (this.isFirst) {
      this.firstEvent = _.clone(pointerEvent);
      this.isFirst = false;
    }
    if (this.isFinal) {
      this.firstEvent = _.clone(pointerEvent);
      this.isFinal = false;
    }
    if (this.currentEvent !== false) this.previousEvent = _.clone(this.currentEvent);
    this.currentEvent = _.clone(pointerEvent);
  }

  debug($target) {
    if (this.$debug === false) {
      this.$debug = $(`#debug-pointer-${this.id}`);
      if (this.$debug.length < 1) {
        this.$debug = $(`<div id="debug-pointer-${this.id}" class="debug-pointer"></div>`);
        $target.append(this.$debug);
      }
    }
    this.$debug.html(`<span class="pointer-id">${this.id}</span><span class="event-type">${this.type}</span>`);
    this.$debug.css('transform', `translate3d(${this.currentEvent.clientX}px, ${this.currentEvent.clientY}px, 0)`);
    this.$debug.addClass('visible');
    if (this.isStarted) this.$debug.addClass('active');
    else this.$debug.removeClass('active');
  }

  onEnd(event) {
    if (!this.isStarted) return;
    this.isFinal = true;
    this.isEnded = true;
    this.addEvent(event);
    this.isStarted = false;
  }

  onMove(event) {
    if (!this.isStarted) return;
    this.addEvent(event);
  }

  onStart(event) {
    this.isStarted = true;
    this.isFirst = true;
    this.isFinal = false;
    this.isEnded = false;
    this.addEvent(event);
  }

  remove() {
    if (this.$debug !== false) {
      this.$debug.remove();
    }
    this.isRemoved = true;
  }

  update(now) {
    if (this.isStarted === false) return;

    const timeSinceFirstEvent = now - this.firstEvent.time;
    if (timeSinceFirstEvent > this.options.tapTimeThreshold) {
      this.type = 'drag';
    } else if (this.isFinal) {
      this.type = 'tap';
    }
  }
}
