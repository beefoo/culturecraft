class Texture {
  constructor(options = {}) {
    const defaults = {
      url: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.isLoading = false;
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
    this.isLoading = true;
    const promise = new Promise((resolve, reject) => {
      const loadedTexture = PIXI.Texture.from(url);
      if (loadedTexture.valid) {
        resolve(loadedTexture);
      } else {
        loadedTexture.on('error', (texture, error) => {
          reject(new Error(`Error loading texture ${url}: ${error.message}`));
        });
        loadedTexture.on('loaded', (texture) => {
          resolve(loadedTexture);
        });
      }
    });
    promise.then((texture) => {
      this.loadedTexture = texture;
      this.isLoaded = true;
      this.isLoading = false;
      console.log(`Loaded texture ${this.url}`);
      // account for race condition: destroyed while loading
      if (this.isDestroyed) {
        this.destroy();
      }
    }, (error) => {
      this.isLoaded = false;
      this.loadedTexture = false;
      this.isLoading = false;
      console.log(error.message);
    });
  }
}
