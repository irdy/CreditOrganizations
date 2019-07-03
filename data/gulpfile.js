const converter = require('./converter.js');
const { src, dest } = require('gulp');
const fs = require('fs');
const path = require('path');
const windows1251 = require('windows-1251');

// e.g. ['content_scripts/*.js', 'background_scripts/*js']
const SOURCE = 'src/decoded.xml';
const OUTPUT_DIR = 'dest';

let clearDir = dir => {
    fs.readdir(dir, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(dir, file), err => {
                if (err) throw err;
            })
        }
        console.log(`directory ${dir} was cleared..`);
    })
};

let createDirIfNoExist = dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        console.log(`directory ${dir} successfully created`);
    }
};

let convert = () => {
    createDirIfNoExist(OUTPUT_DIR);
    clearDir(OUTPUT_DIR);
    return src(SOURCE)
        .pipe(converter())
        .pipe(dest(OUTPUT_DIR))
};

let changeEncoding = (cb) => {
    let buffer = fs.readFileSync('src/20190702_ED807_full.xml');
    let str = windows1251.decode(buffer.toString('binary'));
    let reg = /<\?.*?\?>/i;
    str = str.replace(reg, '');
    fs.writeFileSync('src/decoded.xml', str);
    // end of task
    cb();
};

exports.changeEncoding = changeEncoding;
exports.default = convert;