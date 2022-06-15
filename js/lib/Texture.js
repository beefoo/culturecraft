class Texture {
  constructor(options = {}) {
    const defaults = {
      url: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.isLoaded = false;
    this.isDestroyed = false;
    this.loadedTexture = false;
    this.url = this.options.url;
  }

  destroy() {
    this.isDestroyed = true;
    this.isLoaded = false;

    if (this.loadedTexture === false) return;

    this.loadedTexture.destroy(true);
    console.log(`Destroyed ${this.url}`);
  }

  isValid() {
    return this.loadedTexture !== false && this.loadedTexture.valid && this.loadedTexture.width > 0;
  }

  load() {
    const { url } = this;
    if (this.isLoaded) {
      console.log(`${url} already loaded`);
      return;
    }
    if (this.isDestroyed) {
      console.log(`${url} already destroyed`);
      return;
    }
    this.loadedTexture = PIXI.Texture.from(url);
    this.isLoaded = true;
  }
}
