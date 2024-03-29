class App {
  constructor(options = {}) {
    const defaults = {
      canvasEl: '#canvas-wrapper',
      minTimeBetweenItems: 1000,
      tapChanceQueueNext: 0.25, // percent chance a tap will queue the next item
      dragChanceQueueNext: 1, // percent chance a drag will queue the next item
      touchEl: '#touchable',
    };
    const q = StringUtil.queryParams();
    this.options = _.extend({}, defaults, options, q);
  }

  init() {
    this.$window = $(window);
    this.started = false;
    this.firstInteraction = true;
    const dataReady = this.loadData();
    const introReady = this.loadIntro();

    $.when(dataReady, introReady).then(() => this.loadMain());
  }

  loadData() {
    this.metadataManager = new MetadataManager();
    return this.metadataManager.load();
  }

  loadIntro() {
    this.introUI = new IntroUI();
    return this.introUI.loadImages();
  }

  loadListeners() {
    const delayedResize = _.debounce((e) => this.onResize(), 250);
    this.$window.on('resize', delayedResize);
  }

  loadMain() {
    this.lastItemLoad = Date.now();
    this.canvas = new Canvas({
      parent: this.options.canvasEl,
    });
    this.soundManager = new SoundManager();
    this.textureManager = new TextureManager();
    this.textureManager.loadTexture(this.metadataManager.currentItem.textureUrl);
    this.brushManager = new BrushManager({
      canvas: this.canvas,
      soundManager: this.soundManager,
      textureManager: this.textureManager,
    });
    this.itemUI = new ItemUI({
      metadataManager: this.metadataManager,
      onItemChange: () => this.onItemChange(),
      onItemNext: () => this.queueNextItem(),
    });
    this.itemUI.loadItem(this.metadataManager.currentItem);
    this.optionsUI = new OptionsUI({
      onCanvasDownload: () => this.canvas.download(),
      onCanvasReset: () => this.canvas.reset(),
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
    this.keyboardManager = new KeyboardManager({
      pointer: new Pointer({
        id: 'keyboard',
        onDragEnd: (pointer) => {
          this.onDragEnd(pointer);
        },
        onDragStart: (pointer) => {
          this.onDragStart(pointer);
        },
        onTap: (pointer) => {
          this.onTap(pointer);
        },
      }),
    });
    this.introUI.$el.addClass('active');
    this.loadListeners();
    this.render();
  }

  onDragEnd(pointer) {
    const random = Math.random();
    if (random < this.options.dragChanceQueueNext) this.queueNextItem(pointer);
  }

  onDragStart(pointer) {
    if (!this.started) this.start();
    this.brushManager.onDragStart(pointer);
  }

  onItemChange() {
    this.textureManager.loadTexture(this.metadataManager.currentItem.textureUrl);
    this.lastItemLoad = Date.now();
  }

  onResize() {
    this.canvas.onResize();
    this.keyboardManager.onResize();
  }

  onTap(pointer) {
    this.brushManager.onTap(pointer);
    const random = Math.random();
    if (random < this.options.tapChanceQueueNext) this.queueNextItem(pointer);
  }

  queueNextItem(pointer) {
    const isPointer = pointer !== undefined;
    // if (isPointer && this.firstInteraction) {
    //   this.firstInteraction = false;
    //   return;
    // }
    if (isPointer && pointer.isPrimary !== true) return;
    if (isPointer && this.itemUI.isAutoplay === false) return;
    if (this.itemUI.isPinned === true) return;
    const now = Date.now();
    const timeSinceLastLoad = now - this.lastItemLoad;
    if (timeSinceLastLoad < this.options.minTimeBetweenItems) return;
    this.metadataManager.queueNext();
    this.textureManager.loadTexture(this.metadataManager.currentItem.textureUrl);
    this.itemUI.loadItem(this.metadataManager.currentItem);
    this.soundManager.loadRandomSpriteGroup();
    this.lastItemLoad = now;
  }

  render() {
    const now = Date.now();

    this.pointerManager.update(now);
    if (this.options.pointerDebug) this.pointerManager.render(now);
    this.brushManager.render(now);

    window.requestAnimationFrame(() => this.render());
  }

  start() {
    this.started = true;
    this.itemUI.start();
    this.introUI.start();
  }
}
