const _ = require('underscore');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const config = require('./config.json');
const sounds = require('./app/audio/culturecraft_sounds.json');

const creditFilename = './credits.html';
const indexFilename = './index.html';
const findPattern = /(<!-- GENERATED -->.*?<!-- \/GENERATED -->)/;
const replacePattern = '<!-- GENERATED -->(*)<!-- /GENERATED -->';

function updateCreditsFile(filename, metadata) {
  const contents = fs.readFileSync(filename).toString();
  const imagePath = `${config.targetImageDirectory}thumb/`;
  let html = '';
  html += '<h2>Item details</h2>';
  html += '<ul class="item-list">';
  metadata.forEach((item, i) => {
    const source = _.findWhere(config.collections, { id: item.source });
    html += '<li>';
    html += `  <div class="image"><img src="${imagePath}${item.index}.jpg" alt="Thumbnail image of ${item.title}" /></div>`;
    html += '  <div class="details">';
    html += `    <h3><a href="${item.url}" target="_blank">${item.title}</h3>`;
    html += `    <h4>${item.creator} (${item.year})</h4>`;
    html += `    <p><a href="${source.url}">${source.name}</p>`;
    html += '  </div>';
    html += '</li>';
  });
  html += '</ul>';
  html += '<h2>Audio sources</h2>';
  html += '<ul class="audio-list">';
  sounds.groups.forEach((item, i) => {
    html += `<li><a href="${item.url}" target="_blank">${item.title}</a></li>`;
  });
  html += '</ul>';
  const replaceString = replacePattern.replace('(*)', html);
  const newContents = contents.replace(findPattern, replaceString);
  utils.writeFile(fs, filename, newContents);
}

function updateIndexFile(filename, metadata) {

}

utils.readCSV(fs, csv, config.dataFile, (rawData) => {
  const metadata = utils.parseData(rawData);
  updateCreditsFile(creditFilename, metadata);
  updateIndexFile(indexFilename, metadata);
});
