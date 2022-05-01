class PointerManager {
  constructor(options = {}) {
    const defaults = {
      target: '#app',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$target = $(this.options.target);
    this.loadListeners();
  }

  loadListeners() {
    const hammer = new Hammer(this.$target[0]);

    hammer.get('pan').set({
      direction: Hammer.DIRECTION_ALL,
    });
    hammer.on('pan', (e) => {
      this.onDrag(e);
    });
    hammer.on('tap', (e) => {
      this.onTap(e);
    });
  }

  onDrag(event) {
    console.log(event);
  }

  onTap(event) {
    console.log(event);
  }
}
