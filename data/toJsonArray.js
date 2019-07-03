const fs = require('fs');
const json = require('./dist/data.json');

fs.writeFileSync('dist/_data.json', JSON.stringify(json.ED807.BICDirectoryEntry), err => {
    if (err) throw new Error(err);
});