class ItemUI {
  constructor(options = {}) {
    const defaults = {
      menuEl: '#item-menu',
      metadataManager: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$menuEl = $(this.options.menuEl);
    this.menuItemCount = 5; // hard-coded in CSS; will break UI if value is changed
    this.metadataManager = this.options.metadataManager;
    this.currentItem = false;
    let buttonHTML = '<li class="active" data-item-index="<%= index %>"';
    buttonHTML += ' data-history-index="<%= historyIndex %>"><%= buttonHTML %></li>';
    this.buttonTemplate = _.template(buttonHTML);
  }

  loadItem(item) {
    if (this.currentItem && item.index === this.currentItem.index) return;
    this.currentItem = item;
    const $li = $(this.buttonTemplate(item));
    this.$menuEl.append($li);
    setTimeout(() => this.$menuEl.find('li:first').remove(), 10);
  }
}
