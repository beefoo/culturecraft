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
    this.loadListeners();
  }

  debug(x, y) {
    this.ctx.fillStyle = 'rgba(10, 181, 76, 0.5)';
    this.ctx.beginPath();
    this.ctx.ellipse(x, y, 4, 4, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.closePath();
  }

  loadListeners() {
    const delayedResize = _.debounce((e) => this.onResize(), 250);
    this.$window.on('resize', delayedResize);
  }

  onResize() {
    const windowW = this.$window.width();
    const windowH = this.$window.height();
    const canvasW = this.canvas.width;
    const canvasH = this.canvas.height;
    let newCanvasW = canvasW;
    let newCanvasH = canvasH;
    let drawnContentRetrieved = false;
    const { padding } = this.options;
    const needsResize = !canvasW || !canvasH
      || windowW > canvasW || windowH > canvasH
      || !this.initialized;

    if (needsResize) {
      newCanvasW = Math.max(canvasW + padding * 2, windowW + padding * 2);
      newCanvasH = Math.max(canvasH + padding * 2, windowH + padding * 2);
      if (this.initialized) drawnContentRetrieved = createImageBitmap(this.canvas);
      this.canvas.width = newCanvasW;
      this.canvas.height = newCanvasH;
    }

    this.offsetX = Math.round((newCanvasW - windowW) / 2);
    this.offsetY = Math.round((newCanvasH - windowH) / 2);
    this.$parent.css({
      height: `${newCanvasH}px`,
      'margin-left': `-${(newCanvasW / 2)}px`,
      'margin-top': `-${newCanvasH / 2}px`,
      width: `${newCanvasW}px`,
    });

    if (drawnContentRetrieved !== false) {
      const drawX = Math.round((newCanvasW - canvasW) / 2);
      const drawY = Math.round((newCanvasH - canvasH) / 2);
      drawnContentRetrieved.then((bitmap) => {
        this.ctx.clearRect(0, 0, newCanvasW, newCanvasH);
        this.ctx.drawImage(bitmap, drawX, drawY);
      });
    }
  }
}
