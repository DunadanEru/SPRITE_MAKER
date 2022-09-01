const fs = require("fs");
const { createCanvas, loadImage, createImageData } = require("canvas");

// https://github.com/Automattic/node-canvas

const OUTPUT_DIR = "dist";
const INPUTT_DIR = "src";
const INPUTT_DIR_FILES_TO_ADD = `${INPUTT_DIR}/add/`;

const SPRITE_SIZE = {
  w: 48,
  h: 48,
};

const STEP_X = 4;

let CANVAS;
let CTX;

let FILES = fs.readdirSync(INPUTT_DIR_FILES_TO_ADD);
let FILES_LENGTH = FILES.length;

const OUTPUT_FILE = fs.createWriteStream(`${OUTPUT_DIR}/file.png`);

function prepareSprite(img, ctx, pos, light) {
  let _p = pos || { x: 0, y: 0 };

  if (light) {
    ctx.drawImage(img, _p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);

    var imageData = ctx.getImageData(_p.x, _p.y, SPRITE_SIZE.w, SPRITE_SIZE.h);
    var dA = imageData.data;
    var brightnessMul = 3;

    for (var i = 0; i < dA.length; i += 4) {
      var red = dA[i];
      var green = dA[i + 1];
      var blue = dA[i + 2];

      brightenedRed = brightnessMul * red;
      brightenedGreen = brightnessMul * green;
      brightenedBlue = brightnessMul * blue;

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
    });
  });

  const STREAM = CANVAS.createPNGStream();
  STREAM.pipe(OUTPUT_FILE);
  STREAM.on("finish", () => console.log("The PNG file was created."));
});
