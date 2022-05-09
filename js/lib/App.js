class App {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
    };
    const q = StringUtil.queryParams();
    this.options = _.extend({}, defaults, options, q);
  }

  init() {
    this.pointerManager = new PointerManager({
      debug: this.options.pointerDebug !== undefined,
      target: this.options.el,
    });
  }
}
