const getTextContent = () => document.getElementById("src").value;
const setResultHTML = (html) => document.getElementById("dest").innerHTML = html;

const getCounts = () => {
    const text = getTextContent();
    const words = sobStringToWords(text);
    const chars = sobStringToChars(text);
    const utf8s = sobStringToUTF8(text);
    const utf16s = sobStringToUTF16(text);
    let sb = new SobHTMLBuilder;
    console.log(words);
    console.log(chars);
    console.log(utf8s);
    console.log(utf16s);
    sb.writeResult("#words", words.length);
    sb.writeResult("#characters", chars.length);
    sb.writeResult("#UTF-8 codepoints", utf8s.length);
    sb.writeResult("#UTF-16 codepoints", utf16s.length);
    sb.writeVoidTag("br");
    sb.writeResultRichText("word list",
        "[" + sobStringShowList(words, x => `"${sobStringSanitiseEscapes(x)}"`) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("character list",
        "[" + sobStringShowList(chars, x => `'${sobStringSanitiseEscapes(x)}'`) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-8 list",
        "[" + sobStringShowList(utf8s) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-16 list",
        "[" + sobStringShowList(utf16s) + "]"
    );
    setResultHTML(sb);
    console.log("got counts");
}

const getStats = () => {
    const text = getTextContent();
    const wordFreq = sobStatFrequencies(sobStringToWords(text));
    const charFreq = sobStatFrequencies(sobStringToChars(text));
    const utf8Freq = sobStatFrequencies(sobStringToUTF8(text));
    const utf16Freq = sobStatFrequencies(sobStringToUTF16(text));
    let sb = new SobHTMLBuilder;
    sb.writeResultRichText("word frequencies",
        "[" + sobStringShowList(wordFreq, ([x, freq]) => {
            return `["${sobStringSanitiseEscapes(x)}", ${freq}]`;
        }) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("char frequencies",
        "[" + sobStringShowList(charFreq, ([x, freq]) => {
            return `['${sobStringSanitiseEscapes(x)}', ${freq}]`;
        }) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-8 frequencies",
        "[" + sobStringShowList(utf8Freq, ([x, freq]) => `[${x}, ${freq}]`) + "]"
    );
    sb.writeVoidTag("br");
    sb.writeResultRichText("UTF-16 frequencies",
        "[" + sobStringShowList(utf16Freq, ([x, freq]) => `[${x}, ${freq}]`) + "]"
    );
    setResultHTML(sb);
}