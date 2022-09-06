const _ = require('underscore');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const config = require('./config.json');
const sounds = require('./ui/app/audio/culturecraft_sounds.json');

const imageDir = 'app/img/';
const creditFilename = './ui/credits.html';
const indexFilename = './ui/index.html';
const findPattern = /(<!-- GENERATED -->.*?<!-- \/GENERATED -->)/;
const replacePattern = '<!-- GENERATED -->(*)<!-- /GENERATED -->';

function getAudioItemsHTML(items) {
  let html = '';
  html += '<h2>Featured audio</h2>';
  html += '<ul class="audio-list">';
  items.forEach((item, i) => {
    html += `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`;
  });
  html += '</ul>';
  return html;
}

function getCollectionsHTML(collections, items) {
  const imagePath = `${imageDir}thumb/`;
  let html = '';
  html += '<h2>Featured collections</h2>';
  html += '<ul class="collection-list">';
  collections.forEach((collection, i) => {
    html += '<li>';
    if (_.has(collection, 'sampleItems')) {
      html += '<div class="images">';
      collection.sampleItems.forEach((itemIndex) => {
        const item = items[itemIndex];
        html += `<img src="${imagePath}${item.index}.jpg" alt="${item['alt text']}" title="${item.title}" />`;
      });
      html += '</div>';
    } else {
      html += '<div class="image">';
      html += `  <img src="${collection.image}" alt="${collection.imageAlt}" title="${collection.imageTitle}" />`;
      html += '</div>';
    }
    html += '  <div class="text">';
    html += `    <h3><a href="${collection.url}" target="_blank">${collection.collection}</a></h3>`;
    html += `    <p>${collection.description}</p>`;
    html += '  </div>';
    html += '</li>';
  });
  html += '</ul>';
  return html;
}

function getItemsHTML(items) {
  const imagePath = `${imageDir}thumb/`;
  let html = '';
  html += '<h2>Featured collection items</h2>';
  html += '<ul class="item-list">';
  items.forEach((item, i) => {
    const source = _.findWhere(config.collections, { id: item.source });
    let altText = `Thumbnail image of ${item.title}`;
    if (item['alt text'].length > 0) altText = item['alt text'];
    html += '<li>';
    html += `  <div class="image"><img src="${imagePath}${item.index}.jpg" alt="${altText}" /></div>`;
    html += '  <div class="details">';
    html += `    <h3><a href="${item.url}" target="_blank">${item.title}</a></h3>`;
    html += `    <h4>${item.creator} (${item.year})</h4>`;
    html += `    <p><a href="${source.url}">${source.name}</a></p>`;
    html += '  </div>';
    html += '</li>';
  });
  html += '</ul>';
  return html;
}

function updateCreditsFile(filename, metadata) {
  const contents = fs.readFileSync(filename).toString();
  let html = '';
  html += getCollectionsHTML(config.collections, metadata);
  html += getItemsHTML(metadata);
  html += getAudioItemsHTML(sounds.groups);
  const replaceString = replacePattern.replace('(*)', html);
  const newContents = contents.replace(findPattern, replaceString);
  utils.writeFile(fs, filename, newContents);
}

function updateIndexFile(filename, metadata) {
  const contents = fs.readFileSync(filename).toString();
  let html = '';
  html += getCollectionsHTML(config.collections, metadata);
  const replaceString = replacePattern.replace('(*)', html);
  const newContents = contents.replace(findPattern, replaceString);
  utils.writeFile(fs, filename, newContents);
}

utils.readCSV(fs, csv, config.dataFile, (rawData) => {
  const metadata = utils.parseData(rawData);
  updateCreditsFile(creditFilename, metadata);
  updateIndexFile(indexFilename, metadata);
});
