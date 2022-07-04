class TextureManager {
  constructor(options = {}) {
    const defaults = {
      urls: [],
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.urls = this.options.urls;
    this.urlCount = this.urls.length;
    this.currentTexture = new Texture();
  }

  loadTexture(url) {
    this.currentTexture.load(url);
  }

  loadTextureIndex(index) {
    if (index >= this.urlCount) return;

    const url = this.urls[index];
    this.loadTexture(url);
  }
}
