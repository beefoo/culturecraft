class OptionsUI {
  constructor(options = {}) {
    const defaults = {
      menuEl: '#options-menu',
      onCanvasDownload: false,
      onCanvasReset: false,
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.$menuEl = $(this.options.menuEl);
    this.$navEl = this.$menuEl.closest('.options-nav');
    this.loadListeners();
  }

  closeMenu() {
    this.$navEl.removeClass('active');
  }

  downloadCanvas() {
    if (this.options.onCanvasDownload !== false) this.options.onCanvasDownload();
    this.closeMenu();
  }

  static isFullScreen() {
    const d = document;
    return (d.fullscreenElement || d.mozFullScreenElement
      || d.webkitFullscreenElement || d.msFullscreenElement);
  }

  loadListeners() {
    const { $menuEl } = this;
    const $doc = $(document);
    $menuEl.find('.toggle-menu').on('click', (e) => this.toggleMenu());
    $menuEl.find('.toggle-fullscreen').on('click', (e) => this.toggleFullscreen());
    $doc.on('fullscreenchange', (e) => this.onFullscreenChange());
    $menuEl.find('.download-canvas').on('click', (e) => this.downloadCanvas());
    $menuEl.find('.reset-canvas').on('click', (e) => this.resetCanvas());
  }

  onFullscreenChange() {
    const $button = this.$menuEl.find('.toggle-fullscreen');
    if (OptionsUI.isFullScreen()) $button.addClass('active');
    else $button.removeClass('active');
  }

  resetCanvas() {
    if (this.options.onCanvasReset !== false) this.options.onCanvasReset();
    this.closeMenu();
  }

  toggleFullscreen() {
    const d = document;
    const isFullscreen = OptionsUI.isFullScreen();

    if (!isFullscreen) {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen();
      else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    } else if (isFullscreen) {
      if (d.exitFullscreen) d.exitFullscreen();
      else if (d.msExitFullscreen) d.msExitFullscreen();
      else if (d.mozCancelFullScreen) d.mozCancelFullScreen();
      else if (d.webkitExitFullscreen) d.webkitExitFullscreen();
    }

    this.closeMenu();
  }

  toggleMenu() {
    this.$navEl.toggleClass('active');
  }
}
