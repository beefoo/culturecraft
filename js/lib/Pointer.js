class Pointer {
  constructor(options = {}) {
    const defaults = {
      id: '0',
    };
    this.options = _.extend({}, defaults, options);
  }

  init() {
    this.id = this.options.id;
    this.isFirst = true;
    this.firstEvent = false;
    this.previousEvent = false;
    this.currentEvent = false;
    this.finalEvent = false;
    this.isFinal = false;
    this.isRemoved = false;
    this.velocity = 0;
    this.acceleration = 0;
    this.type = 'none';
    this.$debug = false;
  }

  addEvent(event) {
    // console.log(event);
    const pointerEvent = _.pick(event, 'clientX', 'clientY', 'isPrimary', 'pointerType', 'type');
    pointerEvent.time = Date.now() / 1000.0;
    if (!this.firstEvent) this.firstEvent = pointerEvent;
    else this.isFirst = false;
    if (this.currentEvent !== false) this.previousEvent = this.currentEvent;
    this.currentEvent = pointerEvent;
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
    if (this.isFinal) this.$debug.removeClass('active');
    else this.$debug.addClass('active');
  }

  remove() {
    if (this.$debug !== false) {
      this.$debug.remove();
    }
    this.isRemoved = true;
  }

  update(now) {
    const { clientX, clientY, time } = this.currentEvent;
  }
}
