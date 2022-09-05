const fs = require("fs");
const { createCanvas, loadImage, createImageData } = require("canvas");

const { createCSSChunk, createHTMLChunk } = require("./utils/createCSSChunk");
const createDate = require("./utils/createDate");

// https://github.com/Automattic/node-canvas
const FOLDER = `FLAGS`;

const OUTPUT_DIR = `dist/${FOLDER}`;
const INPUTT_DIR = `src/${FOLDER}`;
const BRIGHTNESS_MULT = 2.5;
const PREFIX = "digi_flag_";
const SPRITE_SIZE = {
  w: 24,
  h: 24,
};

let CSS_FILE_NAME = `flags.css`;
let HTML_FILE_NAME = `index.html`;
let IMAGE_FILE_NAME = `flags.png`;

let OUTPUT_CSS_FILE_PATH = `${OUTPUT_DIR}/${CSS_FILE_NAME}`;
let OUTPUT_HTML_FILE_PATH = `${OUTPUT_DIR}/${HTML_FILE_NAME}`;
let OUTPUT_IMAGE_FILE_PATH = `${OUTPUT_DIR}/${IMAGE_FILE_NAME}`;

let OUTPUT_CSS_CONTENT = ``;

let DATE = createDate();

let OUTPUT_CSS_COMMENT = `/*============ ${DATE} ============*/\n`;

let OUTPUT_HTML_START = (imgURL, cssURL) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>preview</title>
      <style>
      body{
        background: #2a2a2a;
      }
      .row{
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      </style>
      <link rel="stylesheet" href="${cssURL}">
  </head>
  <body>
  <main class='row'>\n`;
};

let OUTPUT_HTML_CONTENT = ``;

let OUTPUT_HTML_END = `</main>
</body>
</html>`;

let FILES = fs.readdirSync(INPUTT_DIR_FILES_TO_ADD);
let FILES_LENGTH = FILES.length;

const OUTPUT_FILE = fs.createWriteStream(`${OUTPUT_IMAGE_FILE_PATH}`);

function prepareSprite(img, ctx, pos, light) {
  let _p = pos || { x: 0, y: 0 };
  ctx.drawImage(img, _p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);
}

loadImage(`${INPUTT_DIR}/flags.png`).then((image) => {
  const CW = image.width;
  const CH = image.height + SPRITE_SIZE.h * FILES_LENGTH;

  const CANVAS = createCanvas(CW, CH);
  const CTX = CANVAS.getContext("2d");
  CTX.drawImage(image, 0, 0, SPRITE_SIZE.w, SPRITE_SIZE.h);

  const STREAM = CANVAS.createPNGStream({
    /** Specifies the ZLIB compression level. Defaults to 6. */
    compressionLevel: 9,
    /**
     * Any bitwise combination of `PNG_FILTER_NONE`, `PNG_FITLER_SUB`,
     * `PNG_FILTER_UP`, `PNG_FILTER_AVG` and `PNG_FILTER_PATETH`; or one of
     * `PNG_ALL_FILTERS` or `PNG_NO_FILTERS` (all are properties of the canvas
     * instance). These specify which filters *may* be used by libpng. During
     * encoding, libpng will select the best filter from this list of allowed
     * filters. Defaults to `canvas.PNG_ALL_FITLERS`.
     */
    filters: CANVAS.PNG_ALL_FILTERS,
    /**
     * _For creating indexed PNGs._ The palette of colors. Entries should be in
     * RGBA order.
     */
    // palette: undefined,
    /**
     * _For creating indexed PNGs._ The index of the background color. Defaults
     * to 0.
     */
    // backgroundIndex: 0,
    /** pixels per inch */
    // resolution: 72,
  });

  STREAM.pipe(OUTPUT_FILE);
  STREAM.on("finish", () => console.log("The PNG file was created."));
});
