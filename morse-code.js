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
        charSets.push(sobMorseCharsNonLatin);
    case "international":
        charSets.push(sobMorseCharsInternational);
        break;
    case "american":
        charSets.push(sobMorseCharsAmerican);
        break;
    case "continental":
        charSets.push(sobMorseCharsContinental);
        break;
    }
    if (getOption("numbers")) {
        if (lang == "american") {
            charSets.push(sobMorseCharsNumbersAmerican);
        } else if (lang == "continental") {
            charSets.push(sobMorseCharsNumbersContinental);
        } else {
            charSets.push(sobMorseCharsNumbers);
        }
    }
    if (getOption("punctuation")) {
        charSets.push(sobMorseCharsPunctuation);
    }
    if (getOption("non-standard")) {
        charSets.push(sobMorseCharsNonStandard);
    }
    return charSets;
}

const writeMorseCodeData = (sb, morse, decoder) => {
    var morseBin = sobMorseImplode(morse);
    sb.writeVoidTag("br");
    sb.writeResultRichText("morse code binary signal", morseBin);
    sb.writeTag(["pre style=\"overflow-x : scroll\"", "code"], (sb) => {
        let rulerN = 0;
        let ruler = "";
        for (let i = morseBin.length - 1; i >= 0; i -= 1) {
            ruler += rulerN % 10;
            rulerN += 1;
        }
        sb.write(ruler);
        sb.writeVoidTag("br");
        sb.writeVoidTag("br");
        sb.write(morseBin.replaceAll("1", "▓").replaceAll("0", "_"));
        sb.writeVoidTag("br");
        sb.write(morse.map(morseWord => morseWord.map(morseLetter => {
            const letter = decoder.get(morseLetter) ?? "?";
            const lhsCount = Math.floor(morseLetter.length / 2);
            const rhsCount = Math.max(0, morseLetter.length - lhsCount - 1);
            return "-".repeat(lhsCount) + letter + "-".repeat(rhsCount);
        }).join(" ".repeat(SOB_MORSE_SPACE_LETTER.length))).join(" ".repeat(SOB_MORSE_SPACE_WORD.length)))
    });
}

const writeMorseCodeAudio = (sb, morse) => {
    const morseBin = sobMorseImplode(morse);
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const ditLength = 0.1;
    const audioBuff = audioCtx.createBuffer(
        1,
        audioCtx.sampleRate * ditLength * morseBin.length,
        audioCtx.sampleRate
    );
    const hz = 100;
    let samp = 0;
    for (let chan = 0; chan < audioBuff.numberOfChannels; chan += 1) {
        const chanBuff = audioBuff.getChannelData(chan);
        for (let i = 0; i < audioBuff.length; i++) {
            const morseIdx = Math.floor(i / audioBuff.length * morseBin.length);
            if (morseBin[morseIdx] == "1") {
                samp = Math.sin(i * Math.PI * 2 / hz);
            }
            chanBuff[i] = samp;
        }
    }
    const url = window.URL.createObjectURL(sobAudioBufferToBlob(audioBuff));
    sb.writeAudio(url, "audio/wav");
}

const encodeMorse = () => {
    const text = getTextContent();
    const charSets = getCharSets();
    const encoder = sobMorseEncoderCreate(...charSets);
    const decoder = sobMorseDecoderCreate(...charSets);
    const morse = sobMorseEncode(encoder, text);
    const morseDitDah = sobMorseImplodeDitDah(morse);
    console.log(morseDitDah);
    setTextContent(morseDitDah);
    let sb = new SobHTMLBuilder;
    writeMorseCodeData(sb, morse, decoder);
    writeMorseCodeAudio(sb, morse);
    setResultHTML(sb);
}

const decodeMorse = () => {
    const morseDitDah = getTextContent();
    const decoder = sobMorseDecoderCreate(...getCharSets());
    const morse = sobMorseExplodeDitDah(morseDitDah);
    const text = sobMorseDecode(decoder, morse);
    console.log(text);
    setTextContent(text);
    let sb = new SobHTMLBuilder;
    writeMorseCodeData(sb, morse, decoder);
    writeMorseCodeAudio(sb, morse);
    setResultHTML(sb);
}

const decodeMorseBinary = () => {
    const morseBin = getTextContent();
    const decoder = sobMorseDecoderCreate(...getCharSets());
    const morse = sobMorseExplode(morseBin);
    const text = sobMorseDecode(decoder, morse);
    console.log(text);
    setTextContent(text);
    let sb = new SobHTMLBuilder;
    writeMorseCodeData(sb, morse, decoder);
    writeMorseCodeAudio(sb, morse);
    setResultHTML(sb);
}