class ItemUI {
  constructor(options = {}) {
    const defaults = {
      menuEl: '#item-menu',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$menuEl = $(this.options.menuEl);
  }

  loadItem(item) {
    const $li = `<li class="active">${item.buttonHTML}</li>`;
    this.$menuEl.append($li);
    setTimeout(() => this.$menuEl.find('li:first').remove(), 10);
  }
}
