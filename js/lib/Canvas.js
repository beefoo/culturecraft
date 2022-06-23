class Canvas {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
      dataEl: '#app-data',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$el = $(this.options.el);
    [this.dataEl] = $(this.options.dataEl); // contains merged pixel data from app
    this.onResize();
    this.dataCtx = this.dataEl.getContext('2d');
    this.dataImage = this.dataCtx.getImageData(0, 0, this.width, this.height);
    this.dataPixels = this.dataImage.data;
    this.app = new PIXI.Application({
      backgroundAlpha: 0,
      width: this.width,
      height: this.height,
      resizeTo: this.$el[0],
    });
    this.$el.append(this.app.view);
  }

  addChild(child) {
    this.app.stage.addChild(child);
  }

  debug(x, y) {
    if (!this.debugGraphics) {
      this.debugGraphics = new PIXI.Graphics();
      this.app.stage.addChild(this.debugGraphics);
      this.debugGraphics.beginFill(0x0ab54c, 0.5);
    }
    this.debugGraphics.drawCircle(x, y, 4);
  }

  onResize() {
    this.width = Math.round(this.$el.width());
    this.height = Math.round(this.$el.height());
    this.dataEl.width = this.width;
    this.dataEl.height = this.height;
  }
}
