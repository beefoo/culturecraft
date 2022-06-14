class TextureManager {
  constructor(options = {}) {
    const defaults = {};
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.textures = {};
  }

  loadTexture(url) {
    let texture;

    if (_.has(this.textures, url)) {
      texture = this.textures[url];
    } else {
      texture = new Texture();
      this.textures[url] = texture;
      texture.load(url);
    }

    return texture;
  }

  unloadTexture(url) {
    if (!_.has(this.textures, url)) return;

    const texture = this.textures[url];
    texture.unload();
    this.textures = _.omit(this.textures, url);
  }
}
