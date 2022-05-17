const csv = require('csv-parser');
const fs = require('fs');
const config = require('./config.json');

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
  const columnsOut = [...cfg.metadataProperties];
  const rowsOut = metadata.map((row) => columnsOut.map((col) => row[col]));
  const jsonOut = {
    columns: columnsOut,
    rows: rowsOut,
  };
  const jsonString = JSON.stringify(jsonOut);
  fs.writeFile(cfg.targetDataFile, jsonString, (err) => {
    if (err) throw err;
    console.log(`Wrote ${rowsOut.length} rows to ${cfg.targetDataFile}`);
  });
}

readMetadata(config, (cfg, metadata) => {
  resizeImages(cfg, metadata);
  writeMetadata(cfg, metadata);
});

console.log('Done.');
