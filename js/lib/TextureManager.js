class TextureManager {
  constructor(options = {}) {
    const defaults = {
      urls: [],
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.textures = {};
    this.urls = this.options.urls;
    this.urlCount = this.urls.length;
    this.currentTexture = false;
  }

  loadTexture(url) {
    let texture;

    if (_.has(this.textures, url)) {
      texture = this.textures[url];
    } else {
      texture = new Texture({
        url,
      });
      this.textures[url] = texture;
      texture.load();
    }

    return texture;
  }

  loadTextureIndex(index) {
    if (index >= this.urlCount) return;

    const url = this.urls[index];
    this.loadTexture(url);
  }

  selectTexture(url) {
    if (_.has(this.textures, url)) this.currentTexture = this.textures[url];
    else this.currentTexture = false;
  }

  selectTextureIndex(index) {
    if (index >= this.urlCount) {
      this.currentTexture = false;
      return;
    }
    const url = this.urls[index];
    this.selectTexture(url);
  }

  unloadTexture(url) {
    if (!_.has(this.textures, url)) return;

    const texture = this.textures[url];
    texture.destroy();
    this.textures = _.omit(this.textures, url);
  }

  unloadTextureIndex(index) {
    if (index >= this.urlCount) return;

    const url = this.urls[index];
    this.unloadTexture(url);
  }
}
