class Texture {
  constructor(options = {}) {
    const defaults = {};
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.isLoaded = false;
    this.loadedTexture = false;
    this.url = false;
  }

  load(url) {
    if (url !== this.url) {
      this.isLoaded = false;
    }
    const promise = new Promise((resolve, reject) => {
      if (this.isLoaded) {
        resolve(this.loadedTexture);
      } else {
        this.loadedTexture = PIXI.Texture.from(url);
        if (this.loadedTexture.valid) {
          this.isLoaded = true;
          resolve(this.loadedTexture);
        } else {
          this.loadedTexture.on('error', (texture, error) => {
            reject(new Error(`Error loading texture ${url}: ${error.message}`));
          });
          this.loadedTexture.on('loaded', (texture) => {
            this.isLoaded = true;
            resolve(this.loadedTexture);
          });
        }
      }
    });
    this.url = url;
    return promise;
  }

  unload() {
    if (this.loadedTexture === false) return;

    this.loadedTexture.destroy(true);
  }
}
