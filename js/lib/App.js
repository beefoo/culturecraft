class App {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
    };
    const q = StringUtil.queryParams();
    this.options = _.extend({}, defaults, options, q);
  }

  init() {
    this.canvas = new Canvas({
      el: this.options.el,
    });
    this.brushManager = new BrushManager({
      canvas: this.canvas,
    });
    this.pointerManager = new PointerManager({
      debug: this.options.pointerDebug !== undefined,
      onDrag: (pointer) => {
        this.onDrag(pointer);
      },
      onDragEnd: (pointer) => {
        this.onDragEnd(pointer);
      },
      onDragStart: (pointer) => {
        this.onDragStart(pointer);
      },
      onTap: (pointer) => {
        this.onTap(pointer);
      },
      target: this.options.el,
    });
    this.render();
  }

  onDrag(pointer) {
    this.brushManager.onDrag(pointer);
  }

  onDragEnd(pointer) {
    this.brushManager.onDragEnd(pointer);
  }

  onDragStart(pointer) {
    this.brushManager.onDragStart(pointer);
  }

  onTap(pointer) {
    this.brushManager.onTap(pointer);
  }

  render() {
    const now = Date.now();

    this.pointerManager.update(now);
    if (this.options.pointerDebug) this.pointerManager.render(now);
    this.brushManager.render(now);

    window.requestAnimationFrame(() => this.render());
  }
}
