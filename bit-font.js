const getFileBuffer = () => document.getElementById("json-file").files[0];
const setTextAlphabet = (value) => document.getElementById("dest-alphabet").value = value;
const isNumeric = (n) => !isNaN(n);

const FONT_CELL_SIZE = 16;

const extractFontPages = (json) => {
    let font = [];
    for (const charCode in json) {
        if (!isNumeric(charCode)) {
            continue;
        }
        const char = String.fromCharCode(charCode);
        font.push({
            charCode,
            char : String.fromCharCode(charCode),
            lines : json[charCode],
        });
    }
    return font;
};

const FONT_COL = { r : 0, g : 0, b : 0, a : 255 };
const FONT_COL_BG = { r : 0, g : 0, b : 0, a : 0 };

const refreshFontColour = () => {
    const cssColour = document.getElementById("font-col").value;
    FONT_COL.r = parseInt(cssColour.slice(1, 1 + 2), 16);
    FONT_COL.g = parseInt(cssColour.slice(3, 3 + 2), 16);
    FONT_COL.b = parseInt(cssColour.slice(5, 5 + 2), 16);
}

const setPixel = (iDest, imageData, { r, g, b, a }) => {
    imageData.data[iDest + 0] = r;
    imageData.data[iDest + 1] = g;
    imageData.data[iDest + 2] = b;
    imageData.data[iDest + 3] = a;
};

const setLine = (iDest, imageData, line) => {
    const getPixelColour = (mask) => (line & mask) == 0 ? FONT_COL_BG : FONT_COL;
    setPixel(iDest +  0 * 4, imageData, getPixelColour(0b0000_0000_0000_0001));
    setPixel(iDest +  1 * 4, imageData, getPixelColour(0b0000_0000_0000_0010));
    setPixel(iDest +  2 * 4, imageData, getPixelColour(0b0000_0000_0000_0100));
    setPixel(iDest +  3 * 4, imageData, getPixelColour(0b0000_0000_0000_1000));
    setPixel(iDest +  4 * 4, imageData, getPixelColour(0b0000_0000_0001_0000));
    setPixel(iDest +  5 * 4, imageData, getPixelColour(0b0000_0000_0010_0000));
    setPixel(iDest +  6 * 4, imageData, getPixelColour(0b0000_0000_0100_0000));
    setPixel(iDest +  7 * 4, imageData, getPixelColour(0b0000_0000_1000_0000));
    setPixel(iDest +  8 * 4, imageData, getPixelColour(0b0000_0001_0000_0000));
    setPixel(iDest +  9 * 4, imageData, getPixelColour(0b0000_0010_0000_0000));
    setPixel(iDest + 10 * 4, imageData, getPixelColour(0b0000_0100_0000_0000));
    setPixel(iDest + 11 * 4, imageData, getPixelColour(0b0000_1000_0000_0000));
    setPixel(iDest + 12 * 4, imageData, getPixelColour(0b0001_0000_0000_0000));
    setPixel(iDest + 13 * 4, imageData, getPixelColour(0b0010_0000_0000_0000));
    setPixel(iDest + 14 * 4, imageData, getPixelColour(0b0100_0000_0000_0000));
    setPixel(iDest + 15 * 4, imageData, getPixelColour(0b1000_0000_0000_0000));
};

const copyFontPageToCanvas = (iDest, { lines }, imageData) => {
    for (let iLine in lines) {
        setLine(iDest + iLine * imageData.width * 4, imageData, lines[iLine]);
    }
};

const bitFontIntoImage = () => getFileBuffer().text().then((text) => {
    refreshFontColour();
    const font = extractFontPages(JSON.parse(text));
    const fontCellsPerRow = Math.ceil(Math.sqrt(font.length));
    // get the canvas and resize it
    const canvasSize = fontCellsPerRow * FONT_CELL_SIZE;
    const canvas = document.getElementById("dest-canvas");
    canvas.width = canvasSize; // need to resize the canvas otherwise the image won't fit
    canvas.height = canvasSize;
    // actually draw the image data
    const canvasCtx = canvas.getContext("2d");
    const imageData = canvasCtx.createImageData(canvasSize, canvasSize);
    for (const iPage in font) {
        const pageX = (iPage % fontCellsPerRow);
        const pageY = Math.floor(iPage / fontCellsPerRow);
        const iDest = pageY * imageData.width * 4 * 16 + pageX * 4 * 16;
        copyFontPageToCanvas(iDest, font[iPage], imageData);
    }
    canvasCtx.putImageData(imageData, 0, 0);
    setTextAlphabet(font.reduce((acc, { char }) => acc + char, ""));
});