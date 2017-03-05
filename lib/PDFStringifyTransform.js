'use strict';

const Transform = require('stream').Transform;

//noinspection JSUnusedLocalSymbols
/**
 * Transform PDF text contents object to strings
 * @type {PDFStringifyTransform}
 */
module.exports = class PDFStringifyTransform extends Transform {

  /**
   * Transform text object to string. Whitespace ` ` will be removed by default
   * @param [whitespace='']
   * @param [options]
   */
  constructor(whitespace = '', options = {writableObjectMode: true, readableObjectMode: false}) {
    super(options);
    this.whitespace = whitespace;
  }

  //noinspection JSUnusedLocalSymbols
  /**
   * Transform PDF.js text object to string
   * @param {Object} obj
   * @param {number} [obj.numPages] Number of pages in the document
   * @param {Object} [obj.metadata] PDF metadata
   * @param {number} [obj.page] Current page number
   * @param {Object} [obj.textContent] PDF.js page text content
   * @param [encoding]
   * @param cb
   * @private
   */
  _transform(obj, encoding, cb) {
    if (obj && typeof obj.textContent !== 'undefined') {
      if (typeof obj.page !== 'undefined') {
        console.log('\n\n## Page', obj.page);
      }
      let item;
      let text_content = '';
      // Split text context items
      for (let i = 0, ii = obj.textContent.items.length; i < ii; i++) {
        item = obj.textContent.items[i];
        // Replace whitespace
        if (item.str.length === 1
          && item.str === ' ') {
          text_content += this.whitespace;
          continue;
        }
        text_content += item.str;
      }
      this.push(text_content);
    } else {
      console.log(JSON.stringify(obj));
    }
    cb();
  }
};
