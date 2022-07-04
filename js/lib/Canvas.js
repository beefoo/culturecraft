class Canvas {
  constructor(options = {}) {
    const defaults = {
      parent: '#app',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$parent = $(this.options.parent);
    const $canvas = $('<canvas id="main-canvas" class="canvas"></canvas>');
    this.$parent.append($canvas);
    [this.canvas] = $canvas;
    this.onResize();
    this.ctx = this.canvas.getContext('2d');
    this.ctx.shadowColor = 'rgba(0, 0, 0, .667)';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
  }

  debug(x, y) {
    this.ctx.fillStyle = 'rgba(10, 181, 76, 0.5)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 4, 4, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  onResize() {
    this.width = Math.round(this.$parent.width());
    this.height = Math.round(this.$parent.height());
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
}
