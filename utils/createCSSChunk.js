const fs = require("fs");


function createCSSChunk(selector, position) {
    let _s = selector || 'class';
    _s = `.${_s}`;
    let _p = position || {
        x: 0,
        y: 0
    };

    let chunk =
        `${_s} {\nbackground-position: ${_p.x}px -${_p.y}px;\n}\n`

    return chunk;
}


function createHTMLChunk(selector) {
    let _s = selector || 'class';

    let chunk =
        `<div class=${_s}></div>\n`
    return chunk;
}






module.exports = {
    createCSSChunk: createCSSChunk,
    createHTMLChunk: createHTMLChunk,
};