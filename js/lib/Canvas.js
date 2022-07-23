class Canvas {
  constructor(options = {}) {
    const defaults = {
      downloadFilename: 'MyCanvas.png',
      hiddenContainer: '#hidden-layer',
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
    const $hiddenContainer = $(this.options.hiddenContainer);
    const $hiddenLink = $(`<a href="#" download="${this.options.downloadFilename}"></a>`);
    $hiddenContainer.append($hiddenLink);
    [this.hiddenLink] = $hiddenLink;
    this.onResize();
    this.ctx = this.canvas.getContext('2d');
    this.loadStyle();
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

  // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
  download() {
    const { canvas } = this;
    const filename = this.options.downloadFilename;
    let imageURL = canvas.toDataURL('image/png');
    // Change MIME type to trick the browser to downlaod the file instead of displaying it
    imageURL = imageURL.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');
    // In addition to <a>'s "download" attribute, you can define HTTP-style headers
    imageURL = imageURL.replace(/^data:application\/octet-stream/, `data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=${filename}`);
    this.hiddenLink.href = imageURL;
    setTimeout(() => this.hiddenLink.click(), 20);
  }

  loadListeners() {
    const delayedResize = _.debounce((e) => this.onResize(), 250);
    this.$window.on('resize', delayedResize);
  }

  loadStyle() {
    this.ctx.shadowColor = 'rgba(0, 0, 0, .667)';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetX = 1;
    this.ctx.shadowOffsetY = 1;
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
        this.loadStyle();
      });
    }
  }
}
