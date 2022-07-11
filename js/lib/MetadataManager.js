class MetadataManager {
  constructor(options = {}) {
    const defaults = {
      texturePath: 'img/texture/*.jpg',
      url: 'data/metadata.json',
    };
    this.options = _.extend({}, defaults, options);
  }

  filter(condition = {}) {
    this.queue = _.where(this.metadata, condition);
    this.shuffleQueue();
    this.resetQueue();
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
    if (this.currentIndex >= this.queue.length) this.currentIndex = 0;
    this.currentItem = this.queue[this.currentIndex];
  }

  onLoad(data) {
    const { columns } = data;
    const metadata = _.map(data.rows, (row, index) => _.object(columns, row));
    this.metadata = _.map(metadata, (row, index) => {
      const updatedRow = _.clone(row);
      updatedRow.index = index;
      updatedRow.textureUrl = this.options.texturePath.replace('*', String(index));
      return updatedRow;
    });
    // console.log(this.metadata);
    this.filter();
  }

  resetQueue() {
    this.currentIndex = -1;
    this.currentItem = false;
    this.queueNext();
  }

  shuffleQueue() {
    this.queue = _.shuffle(this.queue);
  }
}
