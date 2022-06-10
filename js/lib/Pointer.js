class Pointer {
  constructor(options = {}) {
    const defaults = {
      id: '0',
      onDrag: (pointer) => {},
      onDragEnd: (pointer) => {},
      onDragStart: (pointer) => {},
      onTap: (pointer) => {},
      removeThreshold: 1000, // after this much time after end event and no start, remove
      tapTimeThreshold: 250, // time it takes to go from tap to press/drag
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.id = this.options.id;
    this.$debug = false;
    this.isRemoved = false;
    this.pointerType = false;

    this.reset();
  }

  addEvent(event) {
    // console.log(event);
    const pointerEvent = _.pick(event, 'clientX', 'clientY', 'isPrimary', 'pointerType', 'type');
    pointerEvent.time = Date.now();
    if (this.isFirst) {
      this.firstEvent = _.clone(pointerEvent);
      this.isFirst = false;
      this.pointerType = pointerEvent.pointerType;
    }
    if (this.isFinal) {
      this.finalEvent = _.clone(pointerEvent);
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

  onDrag() {
    this.options.onDrag(this);
  }

  onDragEnd() {
    this.options.onDragEnd(this);
  }

  onDragStart() {
    this.type = 'drag';
    this.options.onDragStart(this);
  }

  onEnd(event) {
    if (!this.isStarted || this.isRemoved) return;
    this.isFinal = true;
    this.isEnded = true;
    this.addEvent(event);
    this.isStarted = false;

    const timeSinceFirstEvent = this.finalEvent.time - this.firstEvent.time;
    if (timeSinceFirstEvent <= this.options.tapTimeThreshold) {
      this.onTap();
    } else if (this.type === 'drag') {
      this.onDragEnd();
    }
  }

  onMove(event) {
    if (!this.isStarted || this.isRemoved) return;
    this.addEvent(event);
    if (this.type === 'drag') this.onDrag();
  }

  onStart(event) {
    // console.log(event);
    if (this.isRemoved) return;
    this.reset();
    this.isStarted = true;
    this.isFirst = true;
    this.addEvent(event);
  }

  onTap() {
    this.type = 'tap';
    this.options.onTap(this);
  }

  remove() {
    if (this.$debug !== false) {
      this.$debug.remove();
    }
    this.isRemoved = true;
  }

  reset() {
    this.type = 'none';

    this.isStarted = false;
    this.isEnded = false;
    this.isFirst = false;
    this.isFinal = false;

    this.firstEvent = false;
    this.previousEvent = false;
    this.currentEvent = false;
    this.finalEvent = false;
  }

  update(now) {
    if (this.isRemoved) return;

    if (this.isEnded && this.pointerType !== 'mouse') {
      const timeSinceLastEnded = now - this.finalEvent.time;
      if (timeSinceLastEnded > this.options.removeThreshold) {
        this.remove();
        return;
      }
    }

    if (this.isStarted === false || this.type === 'drag') return;

    const timeSinceFirstEvent = now - this.firstEvent.time;
    if (timeSinceFirstEvent > this.options.tapTimeThreshold) {
      this.onDragStart();
    }
  }
}
