class Texture {
  constructor(options = {}) {
    const defaults = {};
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.loadedImage = false;
    this.currentUrl = false;
    this.loadedUrl = false;
  }

  destroy() {
    this.currentUrl = false;
    this.loadedUrl = false;
    this.loadedImage = false;
  }

  isValid() {
    return this.loadedImage !== false
            && this.loadedImage
            && this.loadedImage.width
            && this.loadedImage.width > 0;
  }

  load(url) {
    this.currentUrl = url;

    if (this.loadedUrl === url) {
      console.log(`${url} already loaded`);
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
        if (this.currentUrl === url) {
          this.loadedImage = image;
          this.loadedUrl = url;
        }
      })
      .catch(() => console.log(`Failed to load texture ${url}`));
  }
}
