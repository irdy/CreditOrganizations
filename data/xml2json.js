const fs = require('fs');
const path = require('path');
const xml2json = require('xml2json');

const SOURCE = 'dest/decoded.xml';
const OUTPUT = 'dist/data.json';

const buffer = fs.readFileSync(path.join(__dirname, SOURCE));
const json = xml2json.toJson(buffer);

fs.writeFileSync(OUTPUT, json, (err) => {
    if (err) throw err;
});