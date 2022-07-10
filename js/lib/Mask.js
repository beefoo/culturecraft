class Mask {
  constructor(options = {}) {
    const defaults = {
      activeW: 256,
      activeH: 256,
      height: 512,
      scaleHeight: 0.2,
      shapeCount: 3,
      width: 512,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    const w = this.options.width;
    const h = this.options.height;
    const { activeW, activeH } = this.options;
    const scaledActiveH = Math.max(Math.round(activeH * this.options.scaleHeight), 8);

    // calculate bounds
    const leftX = Math.ceil((w - activeW) / 2);
    const rightX = Math.floor(leftX + activeW);
    const topY = Math.ceil((h - scaledActiveH) / 2);
    const bottomY = Math.floor(topY + scaledActiveH);
    const centerX = Math.round(w / 2);
    const centerY = Math.round(h / 2);

    const path = new Path2D();
    path.moveTo(leftX, topY);
    path.lineTo(rightX, centerY);
    path.lineTo(leftX, bottomY);
    path.lineTo(leftX, topY);

    this.path = path;
  }
}
