const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const utils = require('./utils');
const config = require('./config.json');

const { argv } = yargs(hideBin(process.argv));

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
    items: {
      columns: columnsOut,
      rows: rowsOut,
    },
    collections: cfg.collections,
  };
  const jsonString = JSON.stringify(jsonOut);
  fs.writeFile(cfg.targetDataFile, jsonString, (err) => {
    if (err) throw err;
    console.log(`Wrote ${rowsOut.length} rows to ${cfg.targetDataFile}`);
  });
}

if (argv.reset) {
  utils.emptyDirectory(fs, `${config.targetImageDirectory}/texture`);
  utils.emptyDirectory(fs, `${config.targetImageDirectory}/thumb`);
}

utils.readCSV(fs, csv, config.dataFile, (rawData) => {
  const metadata = utils.parseData(rawData);
  resizeImages(config, metadata);
  writeMetadata(config, metadata);
});

console.log('Done.');
