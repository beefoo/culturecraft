class Pointer {
  constructor(options = {}) {
    const defaults = {
      id: '0',
    };
    this.options = _.extend({}, defaults, options);
  }

  init() {
    this.isFirst = true;
    this.firstEvent = false;
    this.previousEvent = false;
    this.currentEvent = false;
    this.finalEvent = false;
    this.isFinal = false;
  }

  addEvent(event) {
    if (!this.firstEvent) this.firstEvent = event;
    else this.isFirst = false;
    if (this.currentEvent !== false) this.previousEvent = this.currentEvent;
    this.currentEvent = event;
  }
}
