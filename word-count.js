const getTextContent = () => document.getElementById("src").value;
const setResultHTML = (html) => document.getElementById("dest").innerHTML = html;

function getCounts() {
    const text = getTextContent();
    const words = Sob.stringToWords(text);
    const chars = Sob.stringToChars(text);
    const utf8s = Sob.stringToUTF8(text);
    const utf16s = Sob.stringToUTF16(text);
    let sb = new Sob.HTMLBuilder;
    sb.writeTag("p", sb => {
        console.log(words)
        console.log(chars)
        console.log(utf8s)
        console.log(utf16s)
        sb.writeResult("#words", words.length);
        sb.writeResult("#characters", chars.length);
        sb.writeResult("#UTF-8 codepoints", utf8s.length);
        sb.writeResult("#UTF-16 codepoints", utf16s.length);
    });
    sb.writeResultRichText("word list",
        "[" + Sob.showList(words, x => `"${Sob.sanitiseEscapes(x)}"`) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("character list",
        "[" + Sob.showList(chars, x => `'${Sob.sanitiseEscapes(x)}'`) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-8 list",
        "[" + Sob.showList(utf8s) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-16 list",
        "[" + Sob.showList(utf16s) + "]"
    );
    setResultHTML(sb);
    console.log("got counts");
}

function getStats() {
    const text = getTextContent();
    const wordFreq = Sob.statFrequencies(Sob.stringToWords(text));
    const charFreq = Sob.statFrequencies(Sob.stringToChars(text));
    const utf8Freq = Sob.statFrequencies(Sob.stringToUTF8(text));
    const utf16Freq = Sob.statFrequencies(Sob.stringToUTF16(text));
    let sb = new Sob.HTMLBuilder;
    sb.writeResultRichText("word frequencies",
        "[" + Sob.showList(wordFreq, ([x, freq]) => {
            return `["${Sob.sanitiseEscapes(x)}", ${freq}]`;
        }) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("char frequencies",
        "[" + Sob.showList(charFreq, ([x, freq]) => {
            return `['${Sob.sanitiseEscapes(x)}', ${freq}]`;
        }) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-8 frequencies",
        "[" + Sob.showList(utf8Freq, ([x, freq]) => `[${x}, ${freq}]`) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-16 frequencies",
        "[" + Sob.showList(utf16Freq, ([x, freq]) => `[${x}, ${freq}]`) + "]"
    );
    setResultHTML(sb);
}