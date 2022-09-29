const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

const { createCSSChunk, createHTMLChunk } = require("./utils/createCSSChunk");
const createDate = require("./utils/createDate");

// https://github.com/Automattic/node-canvas

const OUTPUT_DIR = "dist/SPORT_ICONS";

const INPUTT_DIR = "src/SPORT_ICONS";
const INPUTT_DIR_FILES_TO_ADD = `${INPUTT_DIR}/add/`;
const BRIGHTNESS_MULT = 1.6;
const PREFIX = "imgSpr";
const SPRITE_SIZE = {
  w: 80,
  h: 80,
};
const SPRITE_DEFAULT_ICONST_LENGTH = 1;

const SPRITE_OFFSET = SPRITE_SIZE.h * 20;

const SPRITE_ACTUAL_SIZE_TINY = {
  w: 18,
  h: 18,
};

const SPRITE_ACTUAL_SIZE_WEB = {
  w: 24,
  h: 24,
};

const SPRITE_ACTUAL_SIZE_MOB = {
  w: 48,
  h: 48,
};

let CSS_FILE_NAME = `sportIcons.css`;
let HTML_FILE_NAME = `index.html`;
let IMAGE_FILE_NAME = `sportIcons.png`;

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
      <title>preview sport icons</title>
      <style>
      body{
        background: #2a2a2a;
      }

      main {
        display: flex;
        gap: 16px;
        flex-direction: column;
      }

      [class^='imgSpr'],
      [class*='imgSpr']{
        overflow:hidden; text-indent:-999px;
        background-image: url(${imgURL});
        background-position: 0 0;
        background-size:100%;
        width: ${SPRITE_ACTUAL_SIZE_WEB.w}px;
        height: ${SPRITE_ACTUAL_SIZE_WEB.h}px;
      }

      .sportIcons2x [class^='imgSpr'],
      .sportIcons2x [class*='imgSpr']{
        overflow:hidden; text-indent:-999px;
        background-image: url(${imgURL});
        background-position: 0 0;
        background-size:100%;
        width: ${SPRITE_ACTUAL_SIZE_MOB.w}px;
        height: ${SPRITE_ACTUAL_SIZE_MOB.h}px;
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
  <main>\n`;
};

let OUTPUT_HTML_CONTENT_WEB = `<div class="row">\n`;

let OUTPUT_HTML_CONTENT_WEB_END = `</div>\n`;

let OUTPUT_HTML_CONTENT_MOB_WRAPPER = `<div class="sportIcons2x row">\n`;

let OUTPUT_HTML_CONTENT_MOB_WRAPPER_END = `</div>\n`;

let OUTPUT_HTML_CONTENT_END = `
</main>
</body>
</html>
`;

let FILES = fs.readdirSync(INPUTT_DIR_FILES_TO_ADD);
let FILES_LENGTH = FILES.length;

const OUTPUT_FILE = fs.createWriteStream(OUTPUT_IMAGE_FILE_PATH);

function prepareSprite(img, ctx, pos) {
  let _p = pos || { x: 0, y: 0 };
  ctx.clearRect(_p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);

  ctx.drawImage(img, _p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);
}

loadImage(`${INPUTT_DIR}/sportIcons.png`).then((image) => {
  let newSpriteEndIndex = FILES[FILES.length - 1].split(".")[0];
  let newSpriteStartIndex = FILES[0].split(".")[0];

  let lastSpriteIndex = image.height / SPRITE_SIZE.h;
  let additionalHeight =
    (newSpriteEndIndex - lastSpriteIndex + SPRITE_DEFAULT_ICONST_LENGTH + 1) *
    SPRITE_SIZE.h;
  let emptyStartIndex = lastSpriteIndex;
  let emptyEndIndex = +newSpriteStartIndex;

  const CW = image.width;
  const CH = image.height + additionalHeight;
  const CANVAS = createCanvas(CW, CH);

  const CTX = CANVAS.getContext("2d");
  CTX.drawImage(image, 0, 0, image.width, image.height);

  FILES.forEach((file, i) => {
    loadImage(`${INPUTT_DIR_FILES_TO_ADD}/${file}`).then((_imagePart) => {
      let fileName = Number(file.split(".")[0]);

      let position = {
        x: 0,
        y: (fileName + SPRITE_DEFAULT_ICONST_LENGTH) * SPRITE_SIZE.h,
      };

      prepareSprite(_imagePart, CTX, position);
    });
  });

  let iconsLength = CH / SPRITE_SIZE.h;

  console.log(iconsLength);

  for (let k = 0; k < iconsLength; k++) {
    let cssPositionTiny = {
      x: 0,
      y: k * SPRITE_ACTUAL_SIZE_TINY.h,
    };

    let _k;
    switch (k - 1) {
      case -1:
        _k = "Default";
        break;
      case 0:
        _k = 0;
        break;
      default:
        _k = k - 1;
        break;
    }

    let prefix = `.${PREFIX}`;
    let selectorWeb = `${PREFIX}${_k}`;

    let selectorTiny = `tg_sport_icons_tiny ${prefix}${_k}`;
    if (!(k >= emptyStartIndex && k <= emptyEndIndex)) {
      OUTPUT_CSS_CONTENT += createCSSChunk(selectorTiny, cssPositionTiny);
      OUTPUT_HTML_CONTENT_MOB_WRAPPER += createHTMLChunk(selectorWeb);
    } else {
      console.log(k);
    }
  }

  for (let k = 0; k < iconsLength; k++) {
    let cssPositionWeb = {
      x: 0,
      y: k * SPRITE_ACTUAL_SIZE_WEB.h,
    };

    let _k;
    switch (k - 1) {
      case -1:
        _k = "Default";
        break;
      case 0:
        _k = 0;
        break;
      default:
        _k = k - 1;
        break;
    }

    let selectorWeb = `${PREFIX}${_k}`;
    if (!(k >= emptyStartIndex && k <= emptyEndIndex)) {
      OUTPUT_CSS_CONTENT += createCSSChunk(selectorWeb, cssPositionWeb);
      OUTPUT_HTML_CONTENT_WEB += createHTMLChunk(selectorWeb);
    }
  }

  for (let k = 0; k < iconsLength; k++) {
    let cssPositionMob = {
      x: 0,
      y: k * SPRITE_ACTUAL_SIZE_MOB.h,
    };

    let _k;
    switch (k - 1) {
      case -1:
        _k = "Default";
        break;
      case 0:
        _k = 0;
        break;
      default:
        _k = k - 1;
        break;
    }

    let prefix = `.${PREFIX}`;
    let selectorWeb = `${PREFIX}${_k}`;

    let selectorMob = `sportIcons2x ${prefix}${_k}`;
    if (!(k >= emptyStartIndex && k <= emptyEndIndex)) {
      OUTPUT_CSS_CONTENT += createCSSChunk(selectorMob, cssPositionMob);
      OUTPUT_HTML_CONTENT_MOB_WRAPPER += createHTMLChunk(selectorWeb);
    }
  }

  let cssContent = `${OUTPUT_CSS_COMMENT}${OUTPUT_CSS_CONTENT}${OUTPUT_CSS_COMMENT}`;

  fs.writeFileSync(OUTPUT_CSS_FILE_PATH, cssContent);

  let htmlContent = `${OUTPUT_HTML_START(
    IMAGE_FILE_NAME,
    CSS_FILE_NAME
  )}${OUTPUT_HTML_CONTENT_WEB}${OUTPUT_HTML_CONTENT_WEB_END}${OUTPUT_HTML_CONTENT_MOB_WRAPPER}${OUTPUT_HTML_CONTENT_MOB_WRAPPER_END}${OUTPUT_HTML_CONTENT_END}`;

  fs.writeFileSync(OUTPUT_HTML_FILE_PATH, htmlContent);

  const STREAM = CANVAS.createPNGStream({
    compressionLevel: 9,
    filters: CANVAS.PNG_ALL_FILTERS,
  });
  STREAM.pipe(OUTPUT_FILE);
  STREAM.on("finish", () => console.log("The PNG file was created."));
});
