class TextureManager {
  constructor(options = {}) {
    const defaults = {};
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.currentTexture = new Texture();
  }

  loadTexture(url) {
    this.currentTexture.load(url);
  }
}
