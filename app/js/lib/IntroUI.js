class IntroUI {
  constructor(options = {}) {
    const defaults = {
      el: '#intro',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$el = $(this.options.el);
  }

  loadImages() {
    const allLoadedPromise = $.Deferred();
    const imgUrls = this.$el.find('img').map((index, el) => el.src).get();
    const uniqueImgUrls = _.uniq(imgUrls);
    const promises = _.map(uniqueImgUrls, (url) => {
      const promise = $.Deferred();
      const image = new Image();
      image.onload = () => promise.resolve(url);
      image.crossOrigin = 'anonymous';
      image.src = url;
      if (image.complete) promise.resolve(image);
      return promise;
    });
    $.when(...promises).then(() => {
      allLoadedPromise.resolve();
    });
    return allLoadedPromise;
  }
}
