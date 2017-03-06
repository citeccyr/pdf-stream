'use strict';

const PDFReadable = require('./PDFReadable');
const PDFStringifyTransform = require ('./PDFStringifyTransform');

/**
 * Gets text stream from PDF
 * @param {string|Object} options
 * @param {string|ArrayBuffer} options.src PDF source, string is URL
 * @param {string} [options.whitespace] String for replace whitespace, by defaults don't replace
 * @param {string} [whitespace] String for replace whitespace, by defaults don't replace
 * @returns {PDFStringifyTransform}
 */
function text(options, whitespace) {
  if (typeof options === 'string'
    || ArrayBuffer.isView(options)) {
    options = {
      src: options
    };
  }
  if (typeof whitespace === 'string') {
    options.whitespace = whitespace;
  }
  const defaults = {
    src: undefined,
    whitespace: false
  };
  const config = Object.assign({}, defaults, options);

  return new PDFReadable({
    src: config.src
  }).pipe(new PDFStringifyTransform({
    whitespace: config.whitespace
  }));
}

module.exports = text;