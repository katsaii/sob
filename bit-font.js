const getFileBuffer = () => document.getElementById("json-file").files[0];

const refreshFontColour = () => {
    const cssColour = document.getElementById("font-col").value;
    SOB_BITFONT_COL.r = parseInt(cssColour.slice(1, 1 + 2), 16);
    SOB_BITFONT_COL.g = parseInt(cssColour.slice(3, 3 + 2), 16);
    SOB_BITFONT_COL.b = parseInt(cssColour.slice(5, 5 + 2), 16);
}

const loadFont = (text) => sobBitfontFromJSON(JSON.parse(text));

const getGlyphsPerRow = (font) => {
    const glyphsPerRow = document.getElementById("font-column-count").value;
    if (glyphsPerRow) {
        return Number(glyphsPerRow);
    } else {
        return Math.ceil(Math.sqrt(font.length));
    }
}

const exportImage = (font, glyphsPerRow) => {
    refreshFontColour();
    // resize and draw to the canvas
    const canvas = document.getElementById("dest-canvas");
    canvas.style.display = "initial";
    const [width, height] = sobBitfontGetAtlasSize(font, glyphsPerRow);
    sobGraphicsCanvasResize(canvas, width, height);
    sobGraphicsCanvasUseImageBuffer(canvas, (imageData) => {
        sobBitfontDrawToCanvas(0, font, imageData, glyphsPerRow);
    });
    console.log("got image");
}

const exportMetadata = (callback) => {
    let sb = new SobHTMLBuilder;
    if (callback != undefined) {
        callback(sb);
    }
    console.log({ sb });
    document.getElementById("dest").innerHTML = sb;
    console.log("got metadata");
};

const exportGlyphs = (glyphs) => glyphs.map(sobBitfontGlyphGetChar).join("");

const exportToGameMaker = () => getFileBuffer().text().then((text) => {
    const font = loadFont(text);
    font.push(sobBitFontCreateGlyphWhitespace(5));
    const glyphsPerRow = getGlyphsPerRow(font);
    exportImage(font, glyphsPerRow);
    exportMetadata((sb) => {
        sb.writeVoidTag("br");
        sb.writeResultRichText("alphabet (includes a space character)",
            exportGlyphs(font)
        );
    });
});

const exportToPixelFont = () => getFileBuffer().text().then((text) => {
    const font = loadFont(text);
    const glyphsPerRow = getGlyphsPerRow(font);
    exportImage(font, glyphsPerRow);
    exportMetadata((sb) => {
        sb.writeVoidTag("br");
        sb.writeResultRichText("alphabet",
            sobBitfontWrapped(font, glyphsPerRow).map(exportGlyphs).join("\n")
        );
        sb.writeVoidTag("br");
        sb.writeResultRichText("pixel font settings.json",
                "TO DO");
    });
});