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

    console.log(`Destroyed ${this.url}`);
    this.loadedTexture = false;
  }

  isValid() {
    return this.loadedTexture !== false && this.loadedTexture.width > 0;
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

    const whenLoaded = new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.crossOrigin = 'anonymous';
      image.src = url;
      if (image.complete) resolve(image);
    });

    whenLoaded
      .then((image) => {
        if (!this.isDestroyed && !this.isLoaded) {
          this.loadedTexture = image;
          this.isLoaded = true;
        }
      })
      .catch(() => console.log(`Failed to load texture ${url}`));
  }
}
