const Sob = { };

Sob.stringToWords = (str) => str.trim().split(/\s+/);

Sob.stringToChars = (str) => Array.from(str);

Sob.stringToUTF16 = (str) => {
    const utf16 = [];
    for (let i = 0; i < str.length; i += 1) {
        utf16.push(str.charCodeAt(i));
    }
    return utf16;
};

Sob.stringToUTF8 = (str) => {
    const utf8 = [];
    for (let i = 0; i < str.length; i += 1) {
        let code = str.charCodeAt(i);
        if (code < 0x80) {
            utf8.push(code);
        } else if (code < 0x800) {
            utf8.push(0xc0 | (code >> 6));
            utf8.push(0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
            utf8.push(0xe0 | (code >> 12));
            utf8.push(0x80 | ((code >> 6) & 0x3f));
            utf8.push(0x80 | (code & 0x3f));
        } else {
            i += 1;
            code = 0x10000 + (((code & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (code >>18));
            utf8.push(0x80 | ((code>>12) & 0x3f));
            utf8.push(0x80 | ((code>>6) & 0x3f));
            utf8.push(0x80 | (code & 0x3f));
        }
    }
    return utf8;
};

Sob.sanitiseHTML = (html) => html
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
        .replace("'", "&#039;");

Sob.sanitiseEscapes = (str) => {
    let chars = {
        "\n" : "\\n", "\r" : "\\r",
        "\f" : "\\f", "\t" : "\\t",
        "\b" : "\\b",
        "\"" : "\\\"", "\'" : "\\'",
    };
    return Sob.stringToChars(str).map(x => chars[x] ?? x).join("");
};

Sob.showList = (xs, each=undefined) => {
    let first = true;
    let sb = "";
    for (const x of xs) {
        if (!first) {
            sb += ", ";
        }
        first = false;
        sb += each == undefined ? x : each(x);
    }
    return sb;
};

Sob.HTMLBuilder = class {
    constructor() { this.text = "" }
    toString() { return this.text }
    write(text) { this.text += text }

    writeTag(tags, content=undefined) {
        const tagsOpen = Array.isArray(tags) ? tags : [tags];
        const tagsClose = tagsOpen.map(tag => tag.split()[0]);
        for (const tag of tagsOpen) {
            this.text += `<${tag}>`;
        }
        if (content != undefined) {
            if (content instanceof Function) {
                content(this);
            } else {
                this.write(content);
            }
        }
        for (const tag of tagsClose) {
            const tagWithoutAttrs = tag.split()[0];
            this.text += `</${tagWithoutAttrs}>`;
        }
    }

    writeVoidTag(tags) {
        const tagsOpen = Array.isArray(tags) ? tags : [tags];
        for (const tag of tagsOpen) {
            this.text += `<${tag} />`;
        }
    }
};

Sob.statFrequencies = (xs) => {
    const db = new Map;
    for (const x of xs) {
        db.set(x, (db.get(x) ?? 0) + 1);
    }
    return Array.from(db).sort((lhs, rhs) => rhs[1] - lhs[1]);
};

Sob.reverseInnerElements = (xs) => xs.map(x => x.reverse());

// 1     -> .
// 111   -> -
// 10111 -> .-

Sob.morseCharsInternational = [
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

Sob.morseCharsNonLatin = [
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

Sob.morseCharsNumbers = [
    ["1", ".----"], ["2", "..---"],
    ["3", "...--"], ["4", "....-"],
    ["5", "....."], ["6", "-...."],
    ["7", "--..."], ["8", "---.."],
    ["9", "----."], ["0", "-----"],
];

Sob.morseCharsPunctuation = [
    [".", ".-.-.-"], [",", "--..--"], ["?", "..--.."],
    ["'", ".----."], ["/", "-..-."],  ["(", "-.--."],
    [")", "-.--.-"], [":", "---..."], ["=", "-...-"],
    ["+", ".-.-."],  ["-", "-....-"], ["\"", ".-..-."],
    ["@", ".--.-."],
];

Sob.morseCharsNonStandard = [
    ["!", "-.-.--"], ["&", ".-..."], [";", "-.-.-."],
    ["_", "..--.-"], ["$", "...-..-"]
];

Sob.morseLetterBin2DitDah = (binLetter) => {
    let letter = "";
    for (const chunk of binLetter.split("0")) {
        if (chunk == "1") {
            letter += ".";
        } else if (chunk == "111") {
            letter += "-";
        } else if (chunk == "?") {
            letter += "?";
        } else {
            // special case, should never happen
            letter += chunk.length;
        }
    }
    return letter;
};

Sob.morseLetterDitDah2Bin = (letter) => Sob.stringToChars(letter)
        .map(x => {
            if (x == ".") {
                return "1";
            } else if (x == "-") {
                return "111";
            } else if (x == "?") {
                return "?";
            } else {
                return "1".repeat(x);
            }
        })
        .join("0");

Sob.createMorseEncoder = (...charSets) => {
    let db = new Map;
    for (const alphabet of charSets) {
        for (const [letter, signal] of alphabet) {
            db.set(letter.toUpperCase(), Sob.morseLetterDitDah2Bin(signal));
        }
    }
    return db;
};

Sob.createMorseDecoder = (...charSets) => {
    let db = new Map;
    for (const alphabet of charSets) {
        for (const [letter, signal] of alphabet) {
            db.set(Sob.morseLetterDitDah2Bin(signal), letter.toUpperCase());
        }
    }
    return db;
};

Sob.MORSE_SPACE_WORD = "0000000";
Sob.MORSE_SPACE_LETTER = "000";

Sob.morseExplode = (morse) => morse
        .split(MORSE_SPACE_WORD)
        .map(morseWord => morseWord.split(MORSE_SPACE_LETTER));

Sob.morseExplodeDitDah = (morse) => morse
        .split("/")
        .map(morseWord => {
            let morseLetters = Sob.stringToWords(morseWord);
            return morseLetters.map(Sob.morseLetterDitDah2Bin);
        });

Sob.morseImplode = (morse) => morse
        .map(morseWord => morseWord.join(MORSE_SPACE_LETTER))
        .join(MORSE_SPACE_WORD);

Sob.morseImplodeDitDah = (morse) => morse
        .map(morseWord => morseWord.map(Sob.morseLetterBin2DitDah).join(" "))
        .join(" / ");

Sob.morseEncode = (encoder, text) => {
    let morse = [];
    for (const word of Sob.stringToWords(text.toUpperCase())) {
        let morseWord = [];
        for (const letter of Sob.stringToChars(word)) {
            const morseLetter = encoder.get(letter) ?? "?";
            morseWord.push(morseLetter);
        }
        morse.push(morseWord);
    }
    return morse;
};

Sob.morseDecode = (decoder, morse) => {
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