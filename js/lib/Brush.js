class Brush {
  constructor(options = {}) {
    const defaults = {
      canvas: false,
      pointer: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.canvas = this.options.canvas;
    this.pointer = this.options.pointer;
    this.isRemoved = false;
  }

  onDrag() {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const { canvas, pointer } = this;
  }

  onDragEnd() {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const { canvas, pointer } = this;

    this.remove();
  }

  onDragStart() {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const { canvas, pointer } = this;
  }

  onTap() {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const { canvas, pointer } = this;

    this.remove();
  }

  remove() {
    this.canvas = false;
    this.pointer = false;
    this.isRemoved = true;
  }

  render(now) {
    if (this.canvas === false || this.pointer === false || this.isRemoved) return;

    const { canvas, pointer } = this;
  }
}
