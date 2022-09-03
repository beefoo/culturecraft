class KeyboardManager {
  constructor(options = {}) {
    const defaults = {
      ptsPerSecond: 0.01,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.isActive = false;
    this.keys = {
      up: false, down: false, left: false, right: false,
    };
    this.position = { x: 0, y: 0 };
    this.vector = { x: 0, y: 0 };
    this.pointer = new Pointer({
      id: 'keyboard',
    });
    this.loadListeners();
  }

  loadListeners() {
    const $el = $(document);

    $el.on('keydown', (e) => this.onKeydown(e));
    $el.on('keyup', (e) => this.onKeyup(e));
  }

  onKeydown(event) {
    this.updateKeys(event, true);
    this.updateVector();
  }

  onKeyup(event) {
    this.updateKeys(event, false);
    this.updateVector();
  }

  update() {
    if (!this.isActive) return;

    const px = this.options.ptsPerSecond;

    this.position.x += this.vector.x * px;
    this.position.y += this.vector.y * px;
  }

  updateKeys(key, isActive) {
    if (key === 'w') this.keys.up = isActive;
    else if (key === 'a') this.keys.left = isActive;
    else if (key === 's') this.keys.down = isActive;
    else if (key === 'd') this.keys.right = isActive;
  }

  updateVector() {
    if (this.keys.up === this.keys.down) this.vector.y = 0;
    else if (this.keys.up) this.vector.y = 1;
    else this.vector.y = -1;
    if (this.keys.left === this.keys.right) this.vector.x = 0;
    else if (this.keys.right) this.vector.x = 1;
    else this.vector.x = -1;
    this.isActive = this.vector.x !== 0 || this.vector.y !== 0;
  }
}
