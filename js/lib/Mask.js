class Mask {
  constructor(options = {}) {
    const defaults = {
      height: 512,
      scaleWidth: 1,
      shapeCount: 3,
      width: 512,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    const w = this.options.width;
    const h = this.options.height;
    const d = Math.min(w, h);
    const activeD = Math.floor(d / Math.SQRT2);
    const activeW = Math.max(Math.round(activeD * this.options.scaleWidth), 8);
    const activeH = activeD;
    this.path = new Path2D();
  }
}
