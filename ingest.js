const csv = require('csv-parser');
const fs = require('fs');
const config = require('./ingest/config.json');

function readMetadata(cfg, onFinished) {
  const metadata = [];
  fs.createReadStream(cfg.dataFile)
    .pipe(csv({
      mapValues: ({ header, index, value }) => {
        const newValue = value;
        newValue.Index = parseInt(value.Index, 10);
        return newValue;
      },
    }))
    .on('data', (data) => metadata.push(data))
    .on('end', () => {
      onFinished(cfg, metadata);
    });
}

function resizeImages(cfg, metadata) {

}

function writeMetadata(cfg, metadata) {

}

readMetadata(config, (cfg, metadata) => {
  resizeImages(cfg, metadata);
  writeMetadata(cfg, metadata);
});
