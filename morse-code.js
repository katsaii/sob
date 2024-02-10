const getTextContent = () => document.getElementById("src").value;
const setTextContent = (value) => document.getElementById("dest").value = value;
const getSelection = () => document.getElementById("lang-select").value;
const getOption = (id) => document.getElementById(`check-${id}`).checked;

const getCharSets = () => {
    let charSets = [];
    switch (getSelection()) {
    case "international-non-latin":
        charSets.push(Sob.morseCharsNonLatin);
    case "international":
        charSets.push(Sob.morseCharsInternational);
        break;
    }
    if (getOption("numbers")) {
        charSets.push(Sob.morseCharsNumbers);
    }
    if (getOption("punctuation")) {
        charSets.push(Sob.morseCharsPunctuation);
    }
    if (getOption("non-standard")) {
        charSets.push(Sob.morseCharsNonStandard);
    }
    return charSets;
}

function encodeMorse() {
    const text = getTextContent();
    const encoder = Sob.createMorseEncoder(...getCharSets());
    const morse = Sob.morseEncode(encoder, text);
    const morseDitDah = Sob.morseImplodeDitDah(morse);
    console.log(morseDitDah);
    setTextContent(morseDitDah);
}

function decodeMorse() {
    const morseDitDah = getTextContent();
    const decoder = Sob.createMorseDecoder(...getCharSets());
    const morse = Sob.morseExplodeDitDah(morseDitDah);
    const text = Sob.morseDecode(decoder, morse);
    console.log(text);
    setTextContent(text);
}