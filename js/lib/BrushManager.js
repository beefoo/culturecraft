class BrushManager {
  constructor(options = {}) {
    const defaults = {
      canvas: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.canvas = this.options.canvas;
    this.brushes = {};
  }

  getBrushFromPointer(pointer, resetPointer = false) {
    let brush = _.get(this.brushes, pointer.id);
    if (brush === undefined) {
      brush = new Brush({
        canvas: this.canvas,
        pointer,
      });
      this.brushes[pointer.id] = brush;
    } else if (resetPointer) {
      brush.pointer = pointer;
      this.brushes[pointer.id] = pointer;
    }
    return brush;
  }

  onDrag(pointer) {
    const brush = this.getBrushFromPointer(pointer);
    brush.onDrag();
  }

  onDragEnd(pointer) {
    const brush = this.getBrushFromPointer(pointer);
    brush.onDragEnd();
  }

  onDragStart(pointer) {
    const brush = this.getBrushFromPointer(pointer, true);
    brush.onDragStart();
  }

  onTap(pointer) {
    const brush = this.getBrushFromPointer(pointer, true);
    brush.onTap();
  }

  render(now) {
    const brushesToRemove = [];

    _.each(this.brushes, (brush, id) => {
      brush.render(now);
      if (brush.isRemoved) brushesToRemove.push(id);
    });

    if (brushesToRemove.length > 0) {
      this.brushes = _.omit(this.brushes, brushesToRemove);
    }
  }
}
