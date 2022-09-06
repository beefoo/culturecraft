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
    this.$navEl = this.$menuEl.closest('.nav');
    this.menuItemCount = 5; // hard-coded in CSS; will break UI if value is changed
    this.metadataManager = this.options.metadataManager;
    this.currentItem = false;
    let buttonHTML = '<li class="active" data-item-index="<%= index %>"';
    buttonHTML += ' data-history-index="<%= historyIndex %>"><%= detailHTML %><%= buttonHTML %></li>';
    this.buttonTemplate = _.template(buttonHTML);
    this.lastItemClick = 0;
    this.isPinned = false;
    this.isAutoplay = true;
    this.loadListeners();
  }

  isActive() {
    return this.$navEl.hasClass('active');
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
    if (!this.isAutoplay) {
      $li.find('.autoplay-label').removeClass('active');
      $li.find('.toggle-autoplay').prop('checked', false);
    }
    if (!this.isActive()) {
      $li.find('.toggle-tabindex').attr('tabindex', '-1');
    }
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
    // this.$menuEl.on('click', '.pin-current-item', (e) => this.onClickPinItemButton(e));
    this.$menuEl.on('click', '.toggle-nav', (e) => this.onClickToggleNav(e));
    this.$menuEl.on('change', '.toggle-autoplay', (e) => this.onChangeAutoplay(e));
  }

  onChangeAutoplay(event) {
    const $checkbox = $(event.currentTarget);
    const isAutoplay = $checkbox.prop('checked');
    this.isAutoplay = isAutoplay;
    this.$menuEl.find('.autoplay-label').each((index, el) => {
      const $label = $(el);
      if (isAutoplay) $label.addClass('active');
      else $label.removeClass('active');
      $label.find('.toggle-autoplay').prop('checked', isAutoplay);
    });
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

    if (delta > 0) {
      this.unpin();
      this.goBack(delta);
      if (this.options.onItemChange) this.options.onItemChange();
    }
  }

  onClickNextItemButton(event) {
    this.unpin();
    if (this.options.onItemNext) this.options.onItemNext();
  }

  onClickPinItemButton(event) {
    const $button = $(event.currentTarget);
    $button.toggleClass('active');
    this.isPinned = $button.hasClass('active');
    if (this.isPinned) $button.text('Unpin this');
    else $button.text('Pin this');
  }

  onClickToggleNav(event) {
    this.$navEl.toggleClass('active');
    if (this.isActive()) {
      this.$menuEl.find('.toggle-tabindex').attr('tabindex', '0');
    } else {
      this.$menuEl.find('.toggle-tabindex').attr('tabindex', '-1');
    }
  }

  start() {
    this.$navEl.addClass('active');
    this.$menuEl.find('.toggle-tabindex').attr('tabindex', '0');
  }

  unpin() {
    this.$menuEl.find('.pin-current-item.active').removeClass('active');
    this.isPinned = false;
  }
}
