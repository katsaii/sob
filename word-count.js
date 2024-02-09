const getTextContent = () => document.getElementById("src").value;
const setResultHTML = html => document.getElementById("dest").innerHTML = html;

function writeResult(sb, title, content) {
    sb.writeTag("div", sb => {
        sb.writeTag("b", title);
        sb.write(" → ");
        sb.writeTag("code", content);
    });
}

function writeResultRichText(sb, title, content) {
    sb.writeTag("div", sb => {
        sb.writeTag("b", title);
        sb.write(" ⤵");
        sb.writeVoidTag("br");
        sb.writeTag("textarea cols=\"80\" rows=\"5\"", content);
    });
}

function getCounts() {
    const text = getTextContent();
    const words = Sob.stringToWords(text);
    const chars = Sob.stringToChars(text);
    const bytes = Sob.stringToUTF8(text);
    let sb = new Sob.HTMLBuilder;
    sb.writeTag("p", sb => {
        writeResult(sb, "#words", words.length);
        writeResult(sb, "#characters", chars.length);
        writeResult(sb, "#bytes", bytes.length);
    });
    writeResultRichText(sb, "word list",
        "[" + Sob.showList(words, x => `"${Sob.sanitiseEscapes(x)}"`) + "]"
    );
    sb.writeVoidTag("br");
    writeResultRichText(sb, "character list",
        "[" + Sob.showList(chars, x => `'${Sob.sanitiseEscapes(x)}'`) + "]"
    );
    sb.writeVoidTag("br");
    writeResultRichText(sb, "byte list",
        "[" + Sob.showList(bytes) + "]"
    );
    setResultHTML(sb);
    console.log("got counts");
}

function getStats() {
    const text = getTextContent();
    const wordFreq = Sob.statFrequencies(Sob.stringToWords(text));
    const charFreq = Sob.statFrequencies(Sob.stringToChars(text));
    const byteFreq = Sob.statFrequencies(Sob.stringToUTF8(text));
    let sb = new Sob.HTMLBuilder;
    writeResultRichText(sb, "word frequencies",
        "[" + Sob.showList(wordFreq, ([x, freq]) => {
            return `["${Sob.sanitiseEscapes(x)}", ${freq}]`;
        }) + "]"
    );
    sb.writeVoidTag("br");
    writeResultRichText(sb, "char frequencies",
        "[" + Sob.showList(charFreq, ([x, freq]) => {
            return `['${Sob.sanitiseEscapes(x)}', ${freq}]`;
        }) + "]"
    );
    sb.writeVoidTag("br");
    writeResultRichText(sb, "byte frequencies",
        "[" + Sob.showList(byteFreq, ([x, freq]) => `[${x}, ${freq}]`) + "]"
    );
    setResultHTML(sb);
}