class App {
  constructor(options = {}) {
    const defaults = {
      canvasEl: '#canvas-wrapper',
      touchEl: '#touchable',
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
      parent: this.options.canvasEl,
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
      target: this.options.touchEl,
    });
    this.render();
  }

  onDragEnd(pointer) {
    this.queueNextItem(pointer);
  }

  onDragStart(pointer) {
    this.brushManager.onDragStart(pointer);
  }

  onTap(pointer) {
    this.brushManager.onTap(pointer);
    const random = Math.random();
    // 1 in 4 chance of queueing the next item
    if (random < 0.25) this.queueNextItem(pointer);
  }

  queueNextItem(pointer) {
    if (pointer.isPrimary === true) {
      this.metadataManager.queueNext();
      this.textureManager.loadTexture(this.metadataManager.currentItem.textureUrl);
    }
  }

  render() {
    const now = Date.now();

    this.pointerManager.update(now);
    if (this.options.pointerDebug) this.pointerManager.render(now);
    this.brushManager.render(now);

    window.requestAnimationFrame(() => this.render());
  }
}
