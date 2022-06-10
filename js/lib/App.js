class App {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
    };
    const q = StringUtil.queryParams();
    this.options = _.extend({}, defaults, options, q);
  }

  init() {
    this.brushManager = new BrushManager();
    this.pointerManager = new PointerManager({
      debug: this.options.pointerDebug !== undefined,
      target: this.options.el,
    });
    this.render();
  }

  render() {
    const now = Date.now();

    this.pointerManager.update(now);
    if (this.options.pointerDebug) this.pointerManager.render(now);
    this.brushManager.render(now);

    window.requestAnimationFrame(() => this.render());
  }
}
