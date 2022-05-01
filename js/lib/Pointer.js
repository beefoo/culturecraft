class Pointer {
  constructor(options = {}) {
    const defaults = {};
    this.options = _.extend({}, defaults, options);
  }

  init() {
    this.initialized = true;
  }
}
