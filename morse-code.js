const getTextContent = () => document.getElementById("src").value;
const setTextContent = (value) => document.getElementById("dest").value = value;
const setResultHTML = (html) => document.getElementById("dest-signal").innerHTML = html;
const getSelection = () => document.getElementById("lang-select").value;
const getOption = (id) => document.getElementById(`check-${id}`).checked;

const getCharSets = () => {
    let charSets = [];
    const lang = getSelection();
    switch (lang) {
    case "international-non-latin":
        charSets.push(Sob.morseCharsNonLatin);
    case "international":
        charSets.push(Sob.morseCharsInternational);
        break;
    case "american":
        charSets.push(Sob.morseCharsAmerican);
        break;
    case "continental":
        charSets.push(Sob.morseCharsContinental);
        break;
    }
    if (getOption("numbers")) {
        if (lang == "american") {
            charSets.push(Sob.morseCharsNumbersAmerican);
        } else if (lang == "continental") {
            charSets.push(Sob.morseCharsNumbersContinental);
        } else {
            charSets.push(Sob.morseCharsNumbers);
        }
    }
    if (getOption("punctuation")) {
        charSets.push(Sob.morseCharsPunctuation);
    }
    if (getOption("non-standard")) {
        charSets.push(Sob.morseCharsNonStandard);
    }
    return charSets;
}

function writeMorseCodeData(morse, decoder) {
    var binMorse = Sob.morseImplode(morse);
    let sb = new Sob.HTMLBuilder;
    sb.writeVoidTag("br");
    sb.writeResultRichText("morse code binary signal", binMorse);
    sb.writeTag(["pre style=\"overflow-x : scroll\"", "code"], sb => {
        let rulerN = 0;
        let ruler = "";
        for (let i = binMorse.length - 1; i >= 0; i -= 1) {
            ruler += rulerN;
            rulerN += 1;
        }
        sb.write(ruler);
        sb.writeVoidTag("br");
        sb.writeVoidTag("br");
        sb.write(binMorse.replaceAll("1", "▓").replaceAll("0", "˽"));
        sb.writeVoidTag("br");
        sb.write(morse.map(morseWord => morseWord.map(morseLetter => {
            const letter = decoder.get(morseLetter) ?? "?";
            const lhsCount = Math.floor(morseLetter.length / 2);
            const rhsCount = Math.max(0, morseLetter.length - lhsCount - 1);
            return "-".repeat(lhsCount) + letter + "-".repeat(rhsCount);
        }).join(" ".repeat(Sob.MORSE_SPACE_LETTER.length))).join(" ".repeat(Sob.MORSE_SPACE_WORD.length)))
    });
    setResultHTML(sb);
}

function encodeMorse() {
    const text = getTextContent();
    const charSets = getCharSets();
    const encoder = Sob.createMorseEncoder(...charSets);
    const decoder = Sob.createMorseDecoder(...charSets);
    const morse = Sob.morseEncode(encoder, text);
    const morseDitDah = Sob.morseImplodeDitDah(morse);
    console.log(morseDitDah);
    setTextContent(morseDitDah);
    writeMorseCodeData(morse, decoder);
}

function decodeMorse() {
    const morseDitDah = getTextContent();
    const decoder = Sob.createMorseDecoder(...getCharSets());
    const morse = Sob.morseExplodeDitDah(morseDitDah);
    const text = Sob.morseDecode(decoder, morse);
    console.log(text);
    setTextContent(text);
    writeMorseCodeData(morse, decoder);
}