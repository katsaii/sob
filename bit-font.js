const getFileBuffer = () => document.getElementById("json-file").files[0];
const setTextAlphabet = (value) => document.getElementById("dest-alphabet").value = value;

const refreshFontColour = () => {
    const cssColour = document.getElementById("font-col").value;
    SOB_BITFONT_COL.r = parseInt(cssColour.slice(1, 1 + 2), 16);
    SOB_BITFONT_COL.g = parseInt(cssColour.slice(3, 3 + 2), 16);
    SOB_BITFONT_COL.b = parseInt(cssColour.slice(5, 5 + 2), 16);
}

const bitFontIntoImage = () => getFileBuffer().text().then((text) => {
    refreshFontColour();
    const font = sobBitfontFromJSON(JSON.parse(text));
    const glyphsPerRow = Math.ceil(Math.sqrt(font.length));
    // get the canvas and resize it
    const [canvasW, canvasH] = sobBitfontGetAtlasSize(font, glyphsPerRow);
    const canvas = document.getElementById("dest-canvas");
    canvas.width = canvasW; // need to resize the canvas otherwise the image won't fit
    canvas.height = canvasH;
    // actually draw the image data
    const canvasCtx = canvas.getContext("2d");
    const imageData = canvasCtx.createImageData(canvasW, canvasH);
    sobBitfontDrawToCanvas(0, font, imageData, glyphsPerRow);
    canvasCtx.putImageData(imageData, 0, 0);
    setTextAlphabet(sobBitfontAlphabetWrapped(font, glyphsPerRow));
});