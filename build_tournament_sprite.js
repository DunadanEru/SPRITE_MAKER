const fs = require("fs");
const { createCanvas, loadImage, createImageData } = require("canvas");

const {createCSSChunk, createHTMLChunk} = require('./utils/createCSSChunk')
// https://github.com/Automattic/node-canvas

const OUTPUT_DIR = "dist";
const INPUTT_DIR = "src";
const INPUTT_DIR_FILES_TO_ADD = `${INPUTT_DIR}/add/`;
const BRIGHTNESS_MULT = 1.6;

const SPRITE_SIZE = {
  w: 48,
  h: 48,
};


let CSS_FILE_NAME = `style.css`;
let HTML_FILE_NAME = `index.html`;
let IMAGE_FILE_NAME = `img.png`;

let OUTPUT_CSS_FILE_PATH = `${OUTPUT_DIR}/${CSS_FILE_NAME}`;
let OUTPUT_HTML_FILE_PATH = `${OUTPUT_DIR}/${HTML_FILE_NAME}`;
let OUTPUT_IMAGE_FILE_PATH = `${OUTPUT_DIR}/${IMAGE_FILE_NAME}`;


let OUTPUT_CSS_CONTENT = ``;

let DATE = new Date();
DATE.toISOString().split('T')[0];

let OUTPUT_CSS_COMMENT = `${DATE}\n========\n`;

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
      div {
        content: '';
        display: block;
        background-image: url(${imgURL});
        background-size: 96px;
        background-position-x: 0px;
        background-position-y: 0px;
        width: 24px;
        height: 24px;
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
}

let OUTPUT_HTML_CONTENT = ``;

let OUTPUT_HTML_END = 
`</main>
</body>
</html>`;

const STEP_X = 4;

let CANVAS;
let CTX;

let FILES = fs.readdirSync(INPUTT_DIR_FILES_TO_ADD);
let FILES_LENGTH = FILES.length;

const OUTPUT_FILE = fs.createWriteStream(`${OUTPUT_IMAGE_FILE_PATH}`);

function prepareSprite(img, ctx, pos, light) {
  let _p = pos || { x: 0, y: 0 };
  if (light) {
    ctx.drawImage(img, _p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);

    var imageData = ctx.getImageData(_p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);
    var dA = imageData.data;

    for (var i = 0; i < dA.length; i += 4) {
      var red = dA[i];
      var green = dA[i + 1];
      var blue = dA[i + 2];

      brightenedRed = BRIGHTNESS_MULT * red;
      brightenedGreen = BRIGHTNESS_MULT * green;
      brightenedBlue = BRIGHTNESS_MULT * blue;

      dA[i] = brightenedRed;
      dA[i + 1] = brightenedGreen;
      dA[i + 2] = brightenedBlue;
    }

    ctx.putImageData(imageData, _p.x, _p.y);
  } else {
    ctx.drawImage(img, _p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);
  }
}

loadImage(`${INPUTT_DIR}/spriteTournament.png`).then((image) => {
  const CW = image.width;
  const CH = image.height + SPRITE_SIZE.h * FILES_LENGTH;
  const SPRITE_WIDTH = image.width;
  const SPRITE_HEIGHT = image.height;

  const CANVAS = createCanvas(CW, CH);
  const CTX = CANVAS.getContext("2d");
  CTX.drawImage(image, 0, 0, image.width, image.height);

  FILES.forEach((file, i) => {
    loadImage(`${INPUTT_DIR_FILES_TO_ADD}/${file}`).then((image) => {
      for (let g = 0; g < STEP_X; g++) {
        let position = {
          x: g * SPRITE_SIZE.w,
          y: SPRITE_HEIGHT + i * SPRITE_SIZE.h,
        };
        let light = g === 0 || g === 2 ? true : false;
        prepareSprite(image, CTX, position, light);
      }
      
      let cssPosition = {
        x: 0,
        y: SPRITE_HEIGHT + i * SPRITE_SIZE.h,
      };
      let fileName = file.split('.')[0];
      let selector = `sprite_file_${fileName}`;
      OUTPUT_CSS_CONTENT += createCSSChunk(selector, cssPosition);
      OUTPUT_CSS_COMMENT += `ID:${fileName} `;
      OUTPUT_HTML_CONTENT += createHTMLChunk(selector);
    }).then(()=>{
      let cssContent = `${OUTPUT_CSS_CONTENT}\n /*${OUTPUT_CSS_COMMENT}*/`
      fs.writeFileSync(OUTPUT_CSS_FILE_PATH, cssContent)

      let htmlContent = `${OUTPUT_HTML_START(IMAGE_FILE_NAME, CSS_FILE_NAME)}${OUTPUT_HTML_CONTENT}${OUTPUT_HTML_END}`
      fs.writeFileSync(OUTPUT_HTML_FILE_PATH, htmlContent)

    });

    
  });

  const STREAM = CANVAS.createPNGStream();
  STREAM.pipe(OUTPUT_FILE);
  STREAM.on("finish", () => console.log("The PNG file was created."));


});
