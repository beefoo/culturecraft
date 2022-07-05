class BrushManager {
  constructor(options = {}) {
    const defaults = {
      canvas: false,
      textureManager: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.canvas = this.options.canvas;
    this.textureManager = this.options.textureManager;
    this.brushes = [];
  }

  addBrushFromPointer(pointer, action) {
    const brush = new Brush({
      action,
      canvas: this.canvas,
      pointer,
      textureManager: this.textureManager,
    });
    this.brushes.push(brush);
    return brush;
  }

  onDragStart(pointer) {
    const brush = this.addBrushFromPointer(pointer, 'drag');
  }

  onTap(pointer) {
    const brush = this.addBrushFromPointer(pointer, 'tap');
  }

  render(now) {
    const brushesToRemove = [];

    _.each(this.brushes, (brush, index) => {
      brush.render(now);
      if (brush.isRemoved) brushesToRemove.push(index);
    });

    if (brushesToRemove.length > 0) {
      this.brushes = _.reject(this.brushes, (brush, index) => brushesToRemove.indexOf(index) >= 0);
    }
  }
}
