class App {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
      metadataUrl: 'data/metadata.json',
      texturePath: 'img/texture/*.jpg',
    };
    const q = StringUtil.queryParams();
    this.options = _.extend({}, defaults, options, q);
  }

  init() {
    const dataReady = this.loadData();

    $.when(dataReady).then(() => this.loadMain());
  }

  loadData() {
    const promise = $.Deferred();

    $.getJSON(this.options.metadataUrl, (data) => {
      const { cols } = data;
      this.dataCount = data.rows.length;
      this.metadata = _.map(data.rows, (row, index) => _.object(cols, row));
      promise.resolve();
    });

    return promise;
  }

  loadMain() {
    this.canvas = new Canvas({
      el: this.options.el,
    });
    this.brushManager = new BrushManager({
      canvas: this.canvas,
    });
    this.pointerManager = new PointerManager({
      debug: this.options.pointerDebug !== undefined,
      onDragStart: (pointer) => {
        this.onDragStart(pointer);
      },
      onTap: (pointer) => {
        this.onTap(pointer);
      },
      target: this.options.el,
    });
    const { texturePath } = this.options;
    const textureUrls = _.map(this.metadata, (row, index) => texturePath.replace('*', String(index)));
    this.textureManager = new TextureManager({
      urls: textureUrls,
    });
    this.textureManager.loadTextureIndex(0);
    this.render();
  }

  onDragStart(pointer) {
    this.brushManager.onDragStart(pointer);
  }

  onTap(pointer) {
    this.brushManager.onTap(pointer);
  }

  render() {
    const now = Date.now();

    this.pointerManager.update(now);
    if (this.options.pointerDebug) this.pointerManager.render(now);
    this.brushManager.render(now);

    window.requestAnimationFrame(() => this.render());
  }
}
