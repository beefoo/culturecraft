class MetadataManager {
  constructor(options = {}) {
    const defaults = {
      texturePath: 'img/texture/*.jpg',
      url: 'data/metadata.json',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.currentIndex = -1;
    this.currentItem = false;
  }

  load() {
    const promise = $.Deferred();

    $.getJSON(this.options.url, (data) => {
      this.onLoad(data);
      promise.resolve();
    });

    return promise;
  }

  queueNext() {
    this.currentIndex += 1;
    if (this.currentIndex >= this.dataCount) this.currentIndex = 0;
    this.currentItem = this.queue[this.currentIndex];
  }

  onLoad(data) {
    const { cols } = data;
    this.dataCount = data.rows.length;
    const metadata = _.map(data.rows, (row, index) => _.object(cols, row));
    this.metadata = _.map(metadata, (row, index) => {
      const updatedRow = _.clone(row);
      updatedRow.index = index;
      updatedRow.textureUrl = this.options.texturePath.replace('*', String(index));
      return updatedRow;
    });
    this.queue = _.shuffle(this.metadata);
    this.queueNext();
  }
}
