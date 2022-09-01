module.exports = {
  emptyDirectory(fs, dirName) {
    fs.readdirSync(dirName, (readErr, files) => {
      if (readErr) throw readErr;
      files.forEach((file, i) => {
        fs.unlinkSync(path.join(dirName, file), (unlinkErr) => {
          if (unlinkErr) throw unlinkErr;
        });
      });
    });
    console.log(`Emptied ${dirName}`);
  },

  parseData(rawData) {
    const data = rawData.map((item) => {
      const newItem = { ...item };
      newItem.index = parseInt(item.index, 10);
      return newItem;
    });
    data.sort((a, b) => {
      if (a.index > b.index) return 1;
      if (b.index > a.index) return -1;
      return 0;
    });
    return data;
  },

  readCSV(fs, csv, filename, onFinished) {
    const rows = [];
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (data) => rows.push(data))
      .on('end', () => {
        onFinished(rows);
        console.log(`Read ${rows.length} rows from ${filename}`);
      });
  },

  writeFile(fs, filename, content) {
    fs.writeFile(filename, content, (err) => {
      if (err) throw err;
      console.log(`Wrote to ${filename}`);
    });
  },
};
