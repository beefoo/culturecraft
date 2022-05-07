class App {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
    };
    this.options = _.extend({}, defaults, options);
  }

  init() {
    this.pointerManager = new PointerManager({
      debug: true,
      target: this.options.el,
    });
  }
}
