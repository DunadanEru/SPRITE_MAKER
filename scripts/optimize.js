const fs = require("fs");
const { createCanvas, loadImage, createImageData } = require("canvas");

const FOLDER = `OPTIMIZE`;
const OUTPUT_DIR = `dist/${FOLDER}D`;
const INPUT_DIR = `src/${FOLDER}`;
const IMAGE_SIZE = {
  w: 40,
  h: 40,
};

let FILES = fs.readdirSync(INPUT_DIR);

function writeFile(file) {
  let srcFilePath = `${INPUT_DIR}/${file}`;
  let CANVAS = createCanvas(IMAGE_SIZE.w, IMAGE_SIZE.w);
  let CTX = CANVAS.getContext("2d");
  // 'fast'|'good'|'best'|'nearest'|'bilinear'
  // CTX.patternQuality = "best";
  // 'fast'|'good'|'best'|'nearest'|'bilinear'
  // CTX.quality = "best";
  let res = new Promise((res) => {
    let out;
    loadImage(srcFilePath)
      .then((img) => {
        out = fs.createWriteStream(`${OUTPUT_DIR}/${file}`);

        let stream = CANVAS.createPNGStream({
          compressionLevel: 9,
          filters: CANVAS.PNG_FILTER_NONE,
          resolution: 72,
        });
        CTX.clearRect(0, 0, IMAGE_SIZE.w, IMAGE_SIZE.h);
        CTX.drawImage(img, 0, 0, IMAGE_SIZE.w, IMAGE_SIZE.h);
        stream.pipe(out);
      })
      .then(() => {
        res();
      });
  });

  return res;
}

function generateImages() {
  let imagesToGenerate = [];
  FILES.forEach((file) => {
    imagesToGenerate.push(writeFile(file));
  });

  Promise.all(imagesToGenerate).then(() => {
    console.log("All images generated");
  });
}

generateImages();
