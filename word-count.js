function getTextContent() {
    return document.getElementById("src").value;
}

function setResultHTML(html) {
    document.getElementById("dest").innerHTML = html;
}

function getCounts() {
    const text = getTextContent();
    const words = Sob.stringToWords(text);
    const chars = Sob.stringToChars(text);
    const bytes = Sob.stringToUTF8(text);
    let sb = "";
    sb += "<p>"
    sb += `<b>#words</b>: <code>${words.length}</code><br>`
    sb += `<b>#characters</b>: <code>${chars.length}</code><br>`
    sb += `<b>#bytes</b>: <code>${bytes.length}</code>`
    sb += "</p>"
    sb += "<details><summary>expand word list</summary><pre><code style=\"text-wrap : wrap\">"
    sb += "[" + Sob.showList(words, x => `"${Sob.sanitiseEscapes(x)}"`) + "]";
    sb += "</code></pre></details>"
    sb += "<details><summary>expand character list</summary><pre><code style=\"text-wrap : wrap\">"
    sb += "[" + Sob.showList(chars, x => `'${Sob.sanitiseEscapes(x)}'`) + "]";
    sb += "</code></pre></details>"
    sb += "<details><summary>expand byte list</summary><pre><code style=\"text-wrap : wrap\">"
    sb += "[" + Sob.showList(bytes) + "]";
    sb += "</code></pre></details>"
    setResultHTML(sb);
    console.log("got counts");
}