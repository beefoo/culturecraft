class Canvas {
  constructor(options = {}) {
    const defaults = {
      padding: 100,
      parent: '#canvas-wrapper',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.initialized = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.$window = $(window);
    this.$parent = $(this.options.parent);
    const $canvas = $('<canvas id="main-canvas" class="canvas" width="300" height="200"></canvas>');
    this.$parent.append($canvas);
    [this.canvas] = $canvas;
    this.onResize();
    this.ctx = this.canvas.getContext('2d');
    this.ctx.shadowColor = 'rgba(0, 0, 0, .667)';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
    this.initialized = true;
  }

  debug(x, y) {
    this.ctx.fillStyle = 'rgba(10, 181, 76, 0.5)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 4, 4, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  onResize() {
    const windowW = this.$window.width();
    const windowH = this.$window.height();
    let canvasW = this.canvas.width;
    let canvasH = this.canvas.height;
    const { padding } = this.options;
    const needsResize = !canvasW || !canvasH
      || windowW > canvasW || windowH > canvasH
      || !this.initialized;

    if (needsResize) {
      canvasW = Math.max(canvasW + padding, windowW + padding);
      canvasH = Math.max(canvasH + padding, windowH + padding);
    }

    this.canvas.width = canvasW;
    this.canvas.height = canvasH;
    this.offsetX = Math.round((canvasW - windowW) / 2);
    this.offsetY = Math.round((canvasH - windowH) / 2);
    this.$parent.css({
      height: `${canvasH}px`,
      'margin-left': `-${(canvasW / 2)}px`,
      'margin-top': `-${canvasH / 2}px`,
      width: `${canvasW}px`,
    });
  }
}
