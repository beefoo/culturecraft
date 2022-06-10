class BrushManager {
  constructor(options = {}) {
    const defaults = {};
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.brushes = {};
  }

  render(now) {
    _.each(this.brushes, (brush, id) => {
      brush.render(now);
    });
  }
}
