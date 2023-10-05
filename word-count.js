const getTextContent = () => document.getElementById("src").value;
const setResultHTML = html => document.getElementById("dest").innerHTML = html;

function writeResult(sb, title, content) {
    sb.writeTag("div", sb => {
        sb.writeTag("b", title);
        sb.write(": ");
        sb.writeTag("code", content);
    });
}

function writeDetails(sb, title, content) {
    sb.writeTag("details", sb => {
        sb.writeTag(["summary", "b"], title);
        sb.writeTag(["code"], content);
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
    writeDetails(sb, "expand word list",
        "[" + Sob.showList(words, x => `"${Sob.sanitiseEscapes(x)}"`) + "]"
    );
    writeDetails(sb, "expand character list",
        "[" + Sob.showList(chars, x => `'${Sob.sanitiseEscapes(x)}'`) + "]"
    );
    writeDetails(sb, "expand byte list",
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
    writeDetails(sb, "expand word frequencies",
        "[" + Sob.showList(wordFreq) + "]"
    );
    writeDetails(sb, "expand char frequencies",
        "[" + Sob.showList(charFreq) + "]"
    );
    writeDetails(sb, "expand byte frequencies",
        "[" + Sob.showList(byteFreq) + "]"
    );
    setResultHTML(sb);
}