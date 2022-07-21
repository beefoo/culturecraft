class MetadataManager {
  constructor(options = {}) {
    const defaults = {
      maxHistorySize: 1000,
      texturePath: 'img/texture/*.jpg',
      url: 'data/metadata.json',
    };
    this.options = _.extend({}, defaults, options);
    this.init();
  }

  init() {
    this.history = [];
    this.queue = [];
    this.filter = {};
  }

  goBackTo(historyIndex) {
    if (historyIndex < 0 || historyIndex >= this.history.length - 1) return 0;

    const delta = (this.history.length - 1) - historyIndex;
    _.times(delta, (i) => {
      const item = this.history.pop();
      this.queue.unshift(item);
    });

    this.currentItem = _.last(this.history);
    return delta;
  }

  load() {
    const promise = $.Deferred();

    $.getJSON(this.options.url, (data) => {
      this.onLoad(data);
      promise.resolve();
    });

    return promise;
  }

  loadQueue() {
    this.queue = _.where(this.metadata, this.filter);
    this.shuffleQueue();
  }

  queueNext() {
    if (this.queue.length <= 0) this.loadQueue();
    const nextItem = this.queue.shift();
    nextItem.historyIndex = this.history.length;
    this.history.push(nextItem);
    this.currentItem = nextItem;

    if (this.history.length > this.options.maxHistorySize) {
      const delta = this.history.length - this.options.maxHistorySize;
      this.history = this.history.slice(delta, this.history.length);
      this.history = _.map(this.history, (item, index) => {
        const updatedItem = _.clone(item);
        updatedItem.historyIndex = index;
        return updatedItem;
      });
      this.currentItem = _.last(this.history);
    }
  }

  onLoad(data) {
    const { items, collections } = data;
    const { columns } = items;
    const metadata = _.map(items.rows, (row, index) => _.object(columns, row));
    this.metadata = _.map(metadata, (row, index) => {
      const updatedRow = _.clone(row);
      updatedRow.index = index;
      updatedRow.historyIndex = -1;
      updatedRow.collection = _.findWhere(collections, { id: row.source });
      updatedRow.textureUrl = this.options.texturePath.replace('*', String(index));
      let thumbHTML = '';
      thumbHTML += `<img src="img/thumb/${index}.jpg"`;
      thumbHTML += ` alt="Thumbnail image of ${row.title}"`;
      thumbHTML += ` title="${row.title}" />`;
      let buttonHTML = '';
      buttonHTML += `<button class="item-button" data-item-index="${index}">`;
      buttonHTML += thumbHTML;
      buttonHTML += '</button>';
      let detailHTML = '';
      detailHTML += '<div class="item-detail">';
      detailHTML += `<h3><a href="${row.url}" target="_blank">${row.title}</a></h3>`;
      detailHTML += `<h4>${row.creator} (${row.year})</h4>`;
      detailHTML += `<h4>Source: <a href="${row.url}" target="_blank">${updatedRow.collection.name}</a></h4>`;
      detailHTML += '</div>';
      updatedRow.thumbHTML = thumbHTML;
      updatedRow.buttonHTML = buttonHTML;
      updatedRow.detailHTML = detailHTML;
      return updatedRow;
    });
    this.dataCount = this.metadata.length;
    this.collections = collections;
    // console.log(this.metadata);
    this.queueNext();
  }

  shuffleQueue() {
    this.queue = _.shuffle(this.queue);
  }
}
