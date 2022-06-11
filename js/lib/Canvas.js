class Canvas {
  constructor(options = {}) {
    const defaults = {
      el: '#app',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$el = $(this.options.el);
  }
}
