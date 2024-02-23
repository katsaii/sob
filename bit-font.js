const asyncGetFileText = (callback) => {
    const textElem = document.getElementById("json-text");
    const fileElem = document.getElementById("json-file");
    if (textElem.value) {
        callback(textElem.value);
    } else {
        fileElem.files[0].text().then(callback);
    }
};

const refreshFontColour = () => {
    const cssColour = document.getElementById("font-col").value;
    SOB_BITFONT_COL.r = parseInt(cssColour.slice(1, 1 + 2), 16);
    SOB_BITFONT_COL.g = parseInt(cssColour.slice(3, 3 + 2), 16);
    SOB_BITFONT_COL.b = parseInt(cssColour.slice(5, 5 + 2), 16);
}

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
    document.getElementById("dest").innerHTML = sb;
    console.log("got metadata");
};

const exportToGameMaker = () => asyncGetFileText((text) => {
    const meta = JSON.parse(text);
    const font = sobBitfontFromJSON(meta);
    font.push(sobBitFontCreateGlyphWhitespace(5));
    const glyphsPerRow = getGlyphsPerRow(font);
    exportImage(font, glyphsPerRow);
    exportMetadata((sb) => {
        sb.writeVoidTag("br");
        sb.writeResultRichText("alphabet (includes a space character)",
            sobBitfontShowGlyphs(font)
        );
    });
});

const exportToPixelFont = () => asyncGetFileText((text) => {
    const meta = JSON.parse(text);
    const font = sobBitfontFromJSON(meta);
    const glyphsPerRow = getGlyphsPerRow(font);
    exportImage(font, glyphsPerRow);
    exportMetadata((sb) => {
        sb.writeVoidTag("br");
        sb.writeResultRichText("alphabet",
            sobBitfontWrapped(font, glyphsPerRow).map(sobBitfontShowGlyphs).join("\n")
        );
        sb.writeVoidTag("br");
        const pfontJSON = sobBitfontIntoPixelFontJSON(meta, font, glyphsPerRow);
        sb.writeResultRichText("pixel font settings.json", pfontJSON);
        sb.writeResultDownload(`${meta.name}-settings.json`, new Blob([pfontJSON], {
            type : 'text/plain'
        }));
    });
});