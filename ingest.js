const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const config = require('./config.json');

const { argv } = yargs(hideBin(process.argv));

function emptyDirectory(dirName) {
  fs.readdirSync(dirName, (readErr, files) => {
    if (readErr) throw readErr;

    files.forEach((file, i) => {
      fs.unlinkSync(path.join(dirName, file), (unlinkErr) => {
        if (unlinkErr) throw unlinkErr;
      });
    });
  });
  console.log(`Emptied ${dirName}`);
}

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
  const inputImageFilename = `${cfg.imageDirectory}${item.filename}`;
  const textureImageFilename = `${cfg.targetImageDirectory}/texture/${i}.jpg`;
  const thumbImageFilename = `${cfg.targetImageDirectory}/thumb/${i}.jpg`;
  const continueNext = (i < metadata.length - 1);
  let processImage = true;

  if (fs.existsSync(textureImageFilename) && fs.existsSync(thumbImageFilename)) {
    processImage = false;
    console.log(`${item.filename} already processed`);
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
          console.log(`Processed ${item.filename}`);
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

if (argv.reset) {
  emptyDirectory(`${config.targetImageDirectory}/texture`);
  emptyDirectory(`${config.targetImageDirectory}/thumb`);
}

readMetadata(config, (cfg, rawData) => {
  const metadata = rawData.map((item) => {
    const newItem = { ...item };
    newItem.index = parseInt(item.index, 10);
    return newItem;
  });
  metadata.sort((a, b) => {
    if (a.index > b.index) return 1;
    if (b.index > a.index) return -1;
    return 0;
  });
  resizeImages(cfg, metadata);
  writeMetadata(cfg, metadata);
});

console.log('Done.');
