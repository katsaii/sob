const sobMorseCharsInternational = [
    ["A", ".-"],   ["B", "-..."], ["C", "-.-."],
    ["D", "-.."],  ["E", "."],    ["F", "..-."],
    ["G", "--."],  ["H", "...."], ["I", ".."],
    ["J", ".---"], ["K", "-.-"],  ["L", ".-.."],
    ["M", "--"],   ["N", "-."],   ["O", "---"],
    ["P", ".--."], ["Q", "--.-"], ["R", ".-."],
    ["S", "..."],  ["T", "-"],    ["U", "..-"],
    ["V", "...-"], ["W", ".--"],  ["X", "-..-"],
    ["Y", "-.--"], ["Z", "--.."],
];

const sobMorseCharsAmerican = [
    ["A", ".2"],    ["B", "2..."], ["C", "..0."],
    ["D", "2.."],   ["E", "."],    ["F", ".2."],
    ["G", "22."],   ["H", "...."], ["I", ".."],
    ["J", "2.2."],  ["K", "2.2"],  ["L", "4"],
    ["M", "22"],    ["N", "2."],   ["O", ".0."],
    ["P", "....."], ["Q", "..2."], ["R", ".0.."],
    ["S", "..."],   ["T", "2"],    ["U", "..2"],
    ["V", "...2"],  ["W", ".22"],  ["X", ".2.."],
    ["Y", "..0.."], ["Z", "...0"],
];

const sobMorseCharsContinental = [
    ["A", ".-"],     ["Ä", ".-.-"],  ["B", "-..."],
    ["C", "-.-."],   ["CH", "----"], ["D", "-.."],
    ["E", "."],      ["F", "..-."],  ["G", "--."],
    ["H", "...."],   ["I", ".."],    ["J", ".."],
    ["K", "-.-"],    ["L", ".-.."],  ["M", "--"],
    ["N", "-."],     ["O", ".-..."], ["Ö", "---."],
    ["P", "....."],  ["Q", "--.-"],  ["R", ".-."],
    ["S", "..."],    ["T", "-"],     ["U", "..-"],
    ["Ŭ", "..--"],   ["V", "...-"],  ["W", ".--"],
    ["X", "..-..."], ["Y", "--..."], ["Z", ".--.."],
];

const sobMorseCharsNonLatin = [
    ["À", ".--.-"],   ["Ä", ".-.-"],  ["Å", ".--.-"],
    ["Ą", ".-.-"],    ["Æ", ".-.-"],  ["Ć", "-.-.."],
    ["Ĉ", "-.-.."],   ["Ç", "-.-.."], ["CH", "----"],
    ["Đ", "..-.."],   // đ
    ["Ð", "..--."],   // ð
    ["É", "..-.."],   ["È", ".-..-"], ["Ę", "..-.."],
    ["Ĝ", "--.-."],   ["Ĥ", "----"],  ["Ĵ", ".---."],
    ["Ł", ".-..-"],   ["Ń", "--.--"], ["Ñ", "--.--"],
    ["Ó", "---."],    ["Ö", "---."],  ["Ø", "---."],
    ["Ś", "...-..."], ["Ŝ", "...-."], ["Š", "----"],
    ["Þ", ".--.."],   ["Ü", "..--"],  ["Ŭ", "..--"],
    ["Ź", "--..-."],  ["Ź", "--..-"],
];

const sobMorseCharsNumbers = [
    ["1", ".----"], ["2", "..---"],
    ["3", "...--"], ["4", "....-"],
    ["5", "....."], ["6", "-...."],
    ["7", "--..."], ["8", "---.."],
    ["9", "----."], ["0", "-----"],
];

const sobMorseCharsNumbersAmerican = [
    ["1", ".22."], ["2", "..2.."],
    ["3", "...2."], ["4", "....2"],
    ["5", "222"], ["6", "......"],
    ["7", "22.."], ["8", "2...."],
    ["9", "2..2"], ["0", "B"],
];

const sobMorseCharsNumbersContinental = [
    ["1", ".--."], ["2", "..-.."],
    ["3", "...-."], ["4", "....-"],
    ["5", "---"], ["6", "......"],
    ["7", "--.."], ["8", "-...."],
    ["9", "-..-"], ["0", "B"],
];

const sobMorseCharsPunctuation = [
    [".", ".-.-.-"], [",", "--..--"], ["?", "..--.."],
    ["'", ".----."], ["/", "-..-."],  ["(", "-.--."],
    [")", "-.--.-"], [":", "---..."], ["=", "-...-"],
    ["+", ".-.-."],  ["-", "-....-"], ["\"", ".-..-."],
    ["@", ".--.-."],
];

const sobMorseCharsNonStandard = [
    ["!", "-.-.--"], ["&", ".-..."], [";", "-.-.-."],
    ["_", "..--.-"], ["$", "...-..-"]
];

const sobMorseDigits = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
    "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

const sobMorseLetterBin2DitDah = (binLetter) => {
    let letter = "";
    for (const chunk of binLetter.split("0")) {
        if (chunk == "1") {
            letter += ".";
        } else if (chunk == "111") {
            letter += "-";
        } else if (chunk == "?") {
            letter += "?";
        } else {
            // special case for abnormal signal lengths
            letter += sobMorseDigits[chunk.length];
        }
    }
    return letter;
};

const sobMorseLetterDitDah2Bin = (letter) => Array.from(letter)
        .map(letterDigit => {
            if (letterDigit == ".") {
                return "1";
            } else if (letterDigit == "-") {
                return "111";
            } else if (letterDigit == "?") {
                return "?";
            } else {
                console.log(letterDigit);
                return "1".repeat(sobMorseDigits.findIndex(x => x == letterDigit));
            }
        })
        .join("0");

const sobMorseEncoderCreate = (...charSets) => {
    let db = new Map;
    for (const alphabet of charSets) {
        for (const [letter, signal] of alphabet) {
            db.set(letter.toUpperCase(), sobMorseLetterDitDah2Bin(signal));
        }
    }
    return db;
};

const sobMorseDecoderCreate = (...charSets) => {
    let db = new Map;
    for (const alphabet of charSets) {
        for (const [letter, signal] of alphabet) {
            db.set(sobMorseLetterDitDah2Bin(signal), letter.toUpperCase());
        }
    }
    return db;
};

const SOB_MORSE_SPACE_WORD = "0000000";
const SOB_MORSE_SPACE_LETTER = "000";

const sobMorseExplode = (morse) => morse
        .split(SOB_MORSE_SPACE_WORD)
        .map(morseWord => morseWord.split(SOB_MORSE_SPACE_LETTER));

const sobMorseExplodeDitDah = (morse) => morse
        .split(/[/_]/)
        .map(morseWord => {
            let morseLetters = morseWord.trim().split(/\s+/);
            return morseLetters.map(sobMorseLetterDitDah2Bin);
        });

const sobMorseImplode = (morse) => morse
        .map(morseWord => morseWord.join(SOB_MORSE_SPACE_LETTER))
        .join(SOB_MORSE_SPACE_WORD);

const sobMorseImplodeDitDah = (morse) => morse
        .map(morseWord => morseWord.map(sobMorseLetterBin2DitDah).join(" "))
        .join(" / ");

const sobMorseEncode = (encoder, text) => {
    let morse = [];
    for (const word of text.toUpperCase().trim().split(/\s+/)) {
        let morseWord = [];
        for (const letter of Array.from(word)) {
            const morseLetter = encoder.get(letter) ?? "?";
            morseWord.push(morseLetter);
        }
        morse.push(morseWord);
    }
    return morse;
};

const sobMorseDecode = (decoder, morse) => {
    let words = [];
    for (const morseWord of morse) {
        let word = "";
        for (const morseLetter of morseWord) {
            const letter = decoder.get(morseLetter) ?? "?";
            word += letter;
        }
        words.push(word);
    }
    return words.join(" ");
};