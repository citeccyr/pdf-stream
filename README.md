# pdf-stream

[![Code Climate](https://codeclimate.com/github/citeccyr/pdf-stream/badges/gpa.svg)](https://codeclimate.com/github/citeccyr/pdf-stream)

> Creates a stream from PDF

Node.js module for streaming PDF text content.

Based on [PDF.js](https://github.com/mozilla/pdf.js) library.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [text(options)](#textoptions)
  - [new PDFReadable(options)](#new-pdfreadableoptions)
  - [new PDFStringifyTransform(options)](#new-pdfstringifytransformoptions)
- [Contribute](#contribute)
- [License](#license)

## Install

```
  npm i pdf-stream --save
```

## Usage

### Basic

#### Text stream from PDF file

```javascript
  'use strict';
  
  const text = require('pdf-stream').text;
  
  // Load file contents to ArrayBuffer synchronously
  let file = './example.pdf';
  let pdf = new Uint8Array(fs.readFileSync(file));
  
  // Stream PDF text to stdout
  text(pdf)
    .pipe(process.stdout);

```

#### Text stream from PDF link 

You need the `XMLHttpRequest` as global variable. 
Install the [xhr2](https://github.com/pwnall/node-xhr2) library locally:

```bash
  npm i xhr2 --save
```

```javascript
  'use strict';
  
  const text = require('pdf-stream').text;
  global.XMLHttpRequest = require('xhr2'); // for PDFJS
  
  let pdf = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
    
  text(pdf)
    .pipe(process.stdout);
```

#### Text stream from PDF link with metadata as XML string

If you got error:

```bash
  ReferenceError: DOMParser is not defined
```

You need the `DOMParser` as global variable, because PDF.js use it for XML metadata parsing. Install the [xmldom](https://github.com/jindw/xmldom) library locally:

```bash
  npm i xmldom --save
```

```javascript
  'use strict';
  
  const text = require('pdf-stream').text;
  global.XMLHttpRequest = require('xhr2');        // File download 
  global.DOMParser = require('xmldom').DOMParser; // XML Metadata parsing
  
  let pdf = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
    
  text(pdf)
    .pipe(process.stdout);
```

### Advanced

#### Create transform class for replacing string

```javascript
  'use strict';
  
  const Transform = require('stream').Transform;
  const pdf_stream = require('pdf-stream');
  const PDFReadable = pdf_stream.PDFReadable;
  const PDFStringifyTransform = pdf_stream.PDFStringifyTransform;
  
  let url = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf';
  
  // Transform class for replacing strings
  class ReplaceTransform extends Transform {
    constructor(options) {
      super({
        writableObjectMode: true,
        readableObjectMode: true
      });
      this.from = options.from;
      this.to = options.to;
    }
  
    // For every object
    _transform(obj, encoding, cb) {
      // Get text content items
      if (typeof obj.textContent !== 'undefined'
        && Array.isArray(obj.textContent.items)) {
        obj.textContent.items.forEach((item, i) => {
          // Working with the PDF.js `textContent` object
          // Replace substring to another
          obj.textContent.items[i].str = item.str.replace(this.from, this.to);
        });
      }
  
      this.push(obj);
      cb();
    }
  
  }
  
  // Pipeline
  new PDFReadable(url)
    .pipe(new ReplaceTransform({
      from: /trace/gi,
      to: ':-)'
    }))
    .pipe(new PDFStringifyTransform()) // Convert stream from object to string 
    .pipe(process.stdout);
```

## API

All methods are streams, use them with `.pipe()`.

### text(options)

> alternative usage: `text(pdf, whitespace)`

Gets text stream from PDF.

Convert PDF to text, optionally can replace whitespaces.

Options:

* `pdf` — URL or ArrayBuffer;
* `whitespace` — the string that replaces the whitespace `␣`. Replacement disabled by default.

> In the PDF.js viewer whitespaces is an empty string.
> For making output comparable with the viewer use: `text(pdf, '')` 

Return: `{stream.Readable}`

### new PDFReadable(options)

> alternative usage: `new PDFReadable(pdf)`

Making the Readable stream in object mode from PDF text content.

Options:

* `pdf` — URL or ArrayBuffer;
* inherit from `stream.Readable` options.

Return: `{stream.Readable}`

### new PDFStringifyTransform(options)

> alternative usage: `new PDFStringifyTransform(whitespace)`

Transform PDF text content object to string.

Options:

* `whitespace` — the string that replaces the whitespace `␣`. Replacement disabled by default;
* inherit from `stream.Transform` options.

Return: `{stream.Readable}`

## Contribute

Contributors are welcome. [Open an issue](https://github.com/citeccyr/pdf-stream/issues/new) or submit pull request.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Apache 2.0

© Sergey N
