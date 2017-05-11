'use strict';

const PDFReadable = require('../lib/PDFReadable');
const PDFStringifyTransform = require('../lib/PDFStringifyTransform');

// Download remote file
global.XMLHttpRequest = require('xhr2'); // for PDFJS
global.DOMParser = require('xmldom').DOMParser;

const src = 'https://socionet.ru/~vic/j-neicon/aerospace/y:2016:i:5:p:16-30.pdf';
//const src = 'http://dspacecris.eurocris.org/bitstream/11366/526/1/CRIS2016_paper_40_Parinov.pdf';
//const src = 'http://nevolin.socionet.ru/files/2014_Nevolin_rfbr.pdf';
//const src = 'http://www.pdt-journal.com/jour/article/viewFile/112/145.pdf';

// Use local file
//const fs = require('fs');
//const TEST_PDF = './CRIS2016_paper_40_Parinov.pdf';
//let pdf_data = new Uint8Array(fs.readFileSync(TEST_PDF));


// Extract PDF text
new PDFReadable(src)
  .on('error', function(err){
    console.error('PDFReadable error', err);
  })
  .pipe(new PDFStringifyTransform({whitespace: ''}))
  .pipe(process.stdout)
;


/**
 * Catch them all
 */
process.on('unhandledRejection', function (reason, p) {
  console.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
