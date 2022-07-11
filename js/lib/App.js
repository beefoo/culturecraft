class App {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
    };
    const q = StringUtil.queryParams();
    this.options = _.extend({}, defaults, options, q);
  }

  init() {
    const dataReady = this.loadData();

    $.when(dataReady).then(() => this.loadMain());
  }

  loadData() {
    this.metadataManager = new MetadataManager();
    return this.metadataManager.load();
  }

  loadMain() {
    this.canvas = new Canvas({
      parent: this.options.el,
    });
    this.textureManager = new TextureManager();
    this.textureManager.loadTexture(this.metadataManager.currentItem.textureUrl);
    this.brushManager = new BrushManager({
      canvas: this.canvas,
      textureManager: this.textureManager,
    });
    this.pointerManager = new PointerManager({
      debug: this.options.pointerDebug !== undefined,
      onDragEnd: (pointer) => {
        this.onDragEnd(pointer);
      },
      onDragStart: (pointer) => {
        this.onDragStart(pointer);
      },
      onTap: (pointer) => {
        this.onTap(pointer);
      },
      target: this.options.el,
    });
    this.render();
  }

  onDragEnd(pointer) {
    if (pointer.isPrimary === true) {
      this.metadataManager.queueNext();
      this.textureManager.loadTexture(this.metadataManager.currentItem.textureUrl);
    }
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
