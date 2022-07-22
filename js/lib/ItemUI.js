class ItemUI {
  constructor(options = {}) {
    const defaults = {
      menuEl: '#item-menu',
      metadataManager: false,
      minTimeBetweenItemClick: 500,
      onItemChange: false,
      onItemNext: false,
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
    buttonHTML += ' data-history-index="<%= historyIndex %>"><%= detailHTML %><%= buttonHTML %></li>';
    this.buttonTemplate = _.template(buttonHTML);
    this.lastItemClick = 0;
    this.loadListeners();
  }

  goBack(delta) {
    const { history } = this.metadataManager;
    const historyCount = history.length;
    const menuDelta = this.menuItemCount - delta;
    this.currentItem = this.metadataManager.currentItem;
    _.times(delta, (i) => {
      const historyIndex = historyCount - i - 1 - menuDelta;
      let html = '<li>&nbps;</li>';
      if (historyIndex >= 0) html = this.buttonTemplate(history[historyIndex]);
      const $li = $(html);
      this.$menuEl.prepend($li);
    });
    setTimeout(() => {
      _.times(delta, (i) => {
        this.$menuEl.find('li:last').remove();
      });
    }, 250);
  }

  loadItem(item) {
    if (this.currentItem && item.index === this.currentItem.index) return;
    this.currentItem = item;
    const $li = $(this.buttonTemplate(item));
    this.$menuEl.append($li);
    setTimeout(() => {
      this.$menuEl.find('li:first').remove();
    }, 10);
    // setTimeout(() => {
    //   $li.find('.item-button').focus();
    // }, 300);
  }

  loadListeners() {
    this.$menuEl.on('click', '.item-button', (e) => this.onClickItemButton(e));
    this.$menuEl.on('click', '.load-next-item', (e) => this.onClickNextItemButton(e));
  }

  onClickItemButton(event) {
    const now = Date.now();
    const timeSinceLastClick = now - this.lastItemClick;
    if (timeSinceLastClick < this.options.minTimeBetweenItemClick) return;
    this.lastItemClick = now;

    const $button = $(event.currentTarget);
    const $li = $button.closest('li');
    const historyIndex = parseInt($li.attr('data-history-index'), 10);
    const delta = this.metadataManager.goBackTo(historyIndex);

    if (delta === 0) console.log('TODO: show item details');
    else if (delta > 0) {
      this.goBack(delta);
      if (this.options.onItemChange) this.options.onItemChange();
    }
  }

  onClickNextItemButton(event) {
    if (this.options.onItemNext) this.options.onItemNext();
  }
}
