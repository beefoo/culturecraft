const csv = require('csv-parser');
const fs = require('fs');
const sharp = require('sharp');
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
      console.log(`Read ${metadata.length} rows from ${cfg.dataFile}`);
    });
}

function resizeImage(cfg, metadata, i) {
  const item = metadata[i];
  const textureImage = sharp(`${cfg.imageDirectory}${item.Filename}`)
    .resize(cfg.textureSize[0], cfg.textureSize[1])
    .then(() => {
      textureImage
        .toFile(`${cfg.targetImageDirectory}/texture/${i}.jpg`)
        .then(() => {
          textureImage
            .resize(cfg.thumbSize[0], cfg.thumbSize[1])
            .toFile(`${cfg.targetImageDirectory}/thumb/${i}.jpg`)
            .then(() => {
              console.log(`Finished ${item.Filename}`);
              if (i < metadata.length - 1) {
                resizeImage(cfg, metadata, i + 1);
              }
            });
        });
    });
}

function resizeImages(cfg, metadata) {
  resizeImage(cfg, metadata, 0);
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
