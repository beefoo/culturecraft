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
    this.currentIndex = -1;
  }

  loadRandomTexture() {
    const index = _.random(0, this.urlCount - 1);
    this.loadTextureIndex(index);
  }

  loadTexture(url) {
    this.currentTexture.load(url);
  }

  loadTextureIndex(index) {
    if (index >= this.urlCount) return;

    const url = this.urls[index];
    this.currentIndex = index;
    this.loadTexture(url);
  }
}
