class OptionsUI {
  constructor(options = {}) {
    const defaults = {
      menuEl: '#options-menu',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$menuEl = $(this.options.menuEl);
    this.loadListeners();
  }

  loadListeners() {
    this.$menuEl.find('.toggle-menu').on('click', (e) => OptionsUI.onClickToggleMenu(e));
  }

  static onClickToggleMenu(event) {
    const $button = $(event.currentTarget);
    $button.closest('.options-nav').toggleClass('active');
  }
}
