# pdf-stream

[//]: # (TODO: Put more badges here.)

> Creates a stream from PDF

NPM package for streaming PDF text content.

Based on [PDF.js](https://github.com/mozilla/pdf.js) library.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
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

#### Load PDF from URL and stream text 

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

### Advanced usage

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


## Contribute

Contributors are welcome. [Open an issue](https://github.com/citeccyr/pdf-stream/issues/new) or submit pull request.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

Apache 2.0

© Sergey N
