const SOB_BITFONT_CELL_SIZE = 16;

const sobBitFontCreateGlyph = (char, lines) => ({
    char, lines, charCode : char.charCodeAt(0)
});

const SOB_BITFONT_WHITESPACE_MASK_MAX = 0b1111_1111_1111_1111;
const SOB_BITFONT_WHITESPACE_MASK = [
    0b0000_0000_0000_0000,
    0b0000_0000_1000_0000,
    0b0000_0001_1000_0000,
    0b0000_0001_1100_0000,
    0b0000_0011_1100_0000,
    0b0000_0011_1110_0000,
    0b0000_0111_1110_0000,
    0b0000_0111_1111_0000,
    0b0000_1111_1111_0000,
    0b0000_1111_1111_1000,
    0b0001_1111_1111_1000,
    0b0001_1111_1111_1100,
    0b0011_1111_1111_1100,
    0b0011_1111_1111_1110,
    0b0111_1111_1111_1110,
    0b0111_1111_1111_1111
];

const sobBitFontCreateGlyphWhitespace = (width) => {
    let space = SOB_BITFONT_WHITESPACE_MASK[width] ?? SOB_BITFONT_WHITESPACE_MASK_MAX;
    return sobBitFontCreateGlyph(" ", Array(SOB_BITFONT_CELL_SIZE).fill(space));
};

const sobBitfontFromJSON = (json) => {
    let font = [];
    for (const charCode in json) {
        if (isNaN(charCode)) {
            continue;
        }
        const char = String.fromCharCode(charCode);
        const lines = json[charCode];
        font.push({ char, lines, charCode : Number(charCode) });
    }
    return font;
};

const sobBitfontGetAtlasSize = (font, glyphsPerRow) => {
    const width = glyphsPerRow * SOB_BITFONT_CELL_SIZE;
    const height = Math.ceil(font.length / glyphsPerRow) * SOB_BITFONT_CELL_SIZE;
    return [
        Math.max(isNaN(width) ? 0 : width, SOB_BITFONT_CELL_SIZE),
        Math.max(isNaN(height) ? 0 : height, SOB_BITFONT_CELL_SIZE)
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

const sobBitfontShowGlyphs = (glyphs) => glyphs.map(({ char }) => char).join("");

const sobBitfontWrapped = (font, glyphsPerRow) => {
    let rows = [[]];
    let currentRow = rows[0];
    for (const iGlyph in font) {
        if (iGlyph != 0 && iGlyph % glyphsPerRow == 0) {
            currentRow = [];
            rows.push(currentRow);
        }
        currentRow.push(font[iGlyph]);
    }
    return rows;
};

const sobBitfontIntoPixelFontJSON = (meta, font, glyphsPerRow) => {
    return JSON.stringify({
        "$baseURI": "https://yal.cc/r/20/pixelfont/",
        "$version": "1.0",
        "in-glyphs": sobBitfontWrapped(font, glyphsPerRow).map(sobBitfontShowGlyphs),
        "glyph-color": "auto",
        "in-kerning": [""],
        "glyph-width": SOB_BITFONT_CELL_SIZE,
        "glyph-height": SOB_BITFONT_CELL_SIZE,
        "glyph-ofs-x": 0,
        "glyph-ofs-y": 0,
        "glyph-sep-x": 0,
        "glyph-sep-y": 0,
        "glyph-base-x": 0,
        "glyph-baseline": 12,
        "glyph-spacing": 0,
        "font-is-mono": false,
        "font-em-square": 1024,
        "font-line-gap": 0,
        "font-ascend": 768,
        "font-descend": -256,
        "font-px-size": 128,
        "contour-type": "pixel",
        "font-type": "ttf",
        "font-name": meta.name,
        "font-author": "",
        "font-copy": `(c) ${meta.copy}`,
        "font-version": "Version 1.0",
        "font-desc": "",
        "font-license": "",
        "font-license-url": "",
        "font-sample-text": "",
        "font-preview-text": [
            "THE QUICK BROWN FOX JUMPS OVER A LAZY DOG.",
            "the quick brown fox jumps over a lazy dog.",
            "0123456789",
            "",
            "Made with Bit Font Maker 2 (probably)",
            "https://www.pentacom.jp/pentacom/bitfontmaker2/",
            "",
            "Processed with Sob",
            "https://www.katsaii.com/sob/bit-font.html",
            "",
            "Designed for pixel font converter",
            "https://yal.cc/r/20/pixelfont/"
        ]
    });
};