class BrushManager {
  constructor(options = {}) {
    const defaults = {};
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.brushes = {};
  }

  getBrushFromPointer(pointer) {
    const brush = _.get(this.brushes, pointer.id);
    return brush;
  }

  onDrag(pointer) {
    const brush = this.getBrushFromPointer(pointer);
  }

  onDragEnd(pointer) {
    const brush = this.getBrushFromPointer(pointer);
  }

  onDragStart(pointer) {
    const brush = this.getBrushFromPointer(pointer);
  }

  onTap(pointer) {
    const brush = this.getBrushFromPointer(pointer);
  }

  render(now) {
    _.each(this.brushes, (brush, id) => {
      brush.render(now);
    });
  }
}
