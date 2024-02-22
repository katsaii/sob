const SOB_BITFONT_CELL_SIZE = 16;

const sobBitfontFromJSON = (json) => {
    let font = [];
    for (const charCode in json) {
        if (isNaN(charCode)) {
            continue;
        }
        const char = String.fromCharCode(charCode);
        const lines = json[charCode];
        font.push({ charCode, char, lines });
    }
    return font;
};

const sobBitfontGetAtlasSize = (font, glyphsPerRow) => {
    const width = glyphsPerRow * SOB_BITFONT_CELL_SIZE;
    const height = Math.ceil(font.length / glyphsPerRow) * SOB_BITFONT_CELL_SIZE;
    console.log({ width, height, glyphsPerRow, len : font.length, SOB_BITFONT_CELL_SIZE });
    return [
        Math.max(width, SOB_BITFONT_CELL_SIZE),
        Math.max(height, SOB_BITFONT_CELL_SIZE)
    ];
};

const SOB_BITFONT_COL = { r : 0, g : 0, b : 0, a : 255 };
const SOB_BITFONT_COL_BG = { r : 0, g : 0, b : 0, a : 0 };

const sobBitfontDrawGlyphToCanvas = (iDest, { lines }, imageData) => {
    const setPixel = (iDest, imageData, { r, g, b, a }) => {
        imageData.data[iDest + 0] = r;
        imageData.data[iDest + 1] = g;
        imageData.data[iDest + 2] = b;
        imageData.data[iDest + 3] = a;
    };
    const setLine = (iDest, imageData, line) => {
        const getColour = (mask) =>
                (line & mask) == 0 ? SOB_BITFONT_COL_BG : SOB_BITFONT_COL;
        setPixel(iDest +  0 * 4, imageData, getColour(0b0000_0000_0000_0001));
        setPixel(iDest +  1 * 4, imageData, getColour(0b0000_0000_0000_0010));
        setPixel(iDest +  2 * 4, imageData, getColour(0b0000_0000_0000_0100));
        setPixel(iDest +  3 * 4, imageData, getColour(0b0000_0000_0000_1000));
        setPixel(iDest +  4 * 4, imageData, getColour(0b0000_0000_0001_0000));
        setPixel(iDest +  5 * 4, imageData, getColour(0b0000_0000_0010_0000));
        setPixel(iDest +  6 * 4, imageData, getColour(0b0000_0000_0100_0000));
        setPixel(iDest +  7 * 4, imageData, getColour(0b0000_0000_1000_0000));
        setPixel(iDest +  8 * 4, imageData, getColour(0b0000_0001_0000_0000));
        setPixel(iDest +  9 * 4, imageData, getColour(0b0000_0010_0000_0000));
        setPixel(iDest + 10 * 4, imageData, getColour(0b0000_0100_0000_0000));
        setPixel(iDest + 11 * 4, imageData, getColour(0b0000_1000_0000_0000));
        setPixel(iDest + 12 * 4, imageData, getColour(0b0001_0000_0000_0000));
        setPixel(iDest + 13 * 4, imageData, getColour(0b0010_0000_0000_0000));
        setPixel(iDest + 14 * 4, imageData, getColour(0b0100_0000_0000_0000));
        setPixel(iDest + 15 * 4, imageData, getColour(0b1000_0000_0000_0000));
    };
    for (let iLine in lines) {
        setLine(iDest + iLine * imageData.width * 4, imageData, lines[iLine]);
    }
};

const sobBitfontDrawToCanvas = (iDest, font, imageData, glyphsPerRow = undefined) => {
    glyphsPerRow ??= Math.floor(imageData.width / SOB_BITFONT_CELL_SIZE);
    for (const iGlyph in font) {
        const glyphX = (iGlyph % glyphsPerRow);
        const glyphY = Math.floor(iGlyph / glyphsPerRow);
        const iGlyphDest = iDest +
                glyphY * 4 * SOB_BITFONT_CELL_SIZE * imageData.width +
                glyphX * 4 * SOB_BITFONT_CELL_SIZE;
        sobBitfontDrawGlyphToCanvas(iGlyphDest, font[iGlyph], imageData);
    }
};

const sobBitfontAlphabet = (font, sep = "") => font.map(({ char }) => char).join(sep);

const sobBitfontAlphabetWrapped = (font, glyphsPerRow, sep = "", sepWrap = "\n") => {
    let alpha = "";
    for (const iGlyph in font) {
        if (iGlyph != 0) {
            alpha += iGlyph % glyphsPerRow == 0 ? sepWrap : sep;
        }
        alpha += font[iGlyph].char;
    }
    return alpha;
};