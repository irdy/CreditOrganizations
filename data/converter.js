const through = require('through2');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

/**
 * remove element from `DOM-tree`
 * @param node
 */
const removeElement = (node) => {
    if (node !== null && node.nodeType === 1) {
        node.parentNode.removeChild(node);
    }
};

/**
 * collect functions and return them
 * @param contents - string
 * @returns {string}
 */
const replacer = contents => {
    const dom = new JSDOM(contents, {
        contentType: "application/xhtml+xml;"
    });
    let accounts = dom.window.document.querySelectorAll('Accounts');
    accounts.forEach(accountNode => removeElement(accountNode));
    contents = dom.serialize();
    return contents;
};

const converter = () => {
    // returns stream again
    return through.obj(function(file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            this.emit('error', new Error('Streaming not supported'));
            return cb();
        }
        let converted = '';
        if (file.isBuffer()) {
            converted = replacer(file.contents.toString());
            file.contents = Buffer.from(converted, 'utf-8');
        }
        this.push(file);
        cb();
    });
};

module.exports = converter;