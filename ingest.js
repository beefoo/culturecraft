const csv = require('csv-parser');
const fs = require('fs');
const sharp = require('sharp');
const config = require('./config.json');

function readMetadata(cfg, onFinished) {
  const metadata = [];
  fs.createReadStream(cfg.dataFile)
    .pipe(csv())
    .on('data', (data) => metadata.push(data))
    .on('end', () => {
      onFinished(cfg, metadata);
      console.log(`Read ${metadata.length} rows from ${cfg.dataFile}`);
    });
}

function resizeImage(cfg, metadata, i) {
  const item = metadata[i];
  const inputImageFilename = `${cfg.imageDirectory}${item.Filename}`;
  const textureImageFilename = `${cfg.targetImageDirectory}/texture/${i}.jpg`;
  const thumbImageFilename = `${cfg.targetImageDirectory}/thumb/${i}.jpg`;
  const continueNext = (i < metadata.length - 1);
  let processImage = true;

  if (fs.existsSync(textureImageFilename) && fs.existsSync(thumbImageFilename)) {
    processImage = false;
    console.log(`${item.Filename} already processed`);
  } else if (!fs.existsSync(inputImageFilename)) {
    processImage = false;
    console.log(`${inputImageFilename} does not exist`);
  }

  if (!processImage) {
    if (continueNext) resizeImage(cfg, metadata, i + 1);
    return;
  }

  const textureImage = sharp(inputImageFilename)
    .resize(cfg.textureSize[0], cfg.textureSize[1]);
  textureImage
    .toFile(textureImageFilename)
    .then(() => {
      textureImage
        .resize(cfg.thumbSize[0], cfg.thumbSize[1])
        .toFile(thumbImageFilename)
        .then(() => {
          console.log(`Processed ${item.Filename}`);
          if (continueNext) resizeImage(cfg, metadata, i + 1);
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

readMetadata(config, (cfg, rawData) => {
  const metadata = rawData.map((item) => {
    const newItem = { ...item };
    newItem.Index = parseInt(item.Index, 10);
    return newItem;
  });
  metadata.sort((a, b) => {
    if (a.Index > b.Index) return 1;
    if (b.Index > a.Index) return -1;
    return 0;
  });
  resizeImages(cfg, metadata);
  writeMetadata(cfg, metadata);
});

console.log('Done.');
