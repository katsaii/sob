const Sob = { };

Sob.stringToWords = (str) => str.split(/\b\s+/);

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

Sob.morseSignalsInternational = [
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

Sob.morseSignalsNonLatin = [

];

Sob.morseSignalsNumbers = [
    ["1", ".----"], ["2", "..---"],
    ["3", "...--"], ["4", "....-"],
    ["5", "....."], ["6", "-...."],
    ["7", "--..."], ["8", "---.."],
    ["9", "----."], ["0", "-----"],
];

Sob.morseSignalsPunctuation = [
    [".", ".-.-.-"], [",", "--..--"], ["?", "..--.."],
    ["'", ".----."], ["/", "-..-."],  ["(", "-.--."],
    [")", "-.--.-"], [":", "---..."], ["=", "-...-"],
    ["+", ".-.-."],  ["-", "-....-"], ["\"", ".-..-."],
    ["@", ".--.-."],
];

Sob.morseSignalsNonStandard = [
    ["!", "-.-.--"], ["&", ".-..."], [";", "-.-.-."],
    ["_", "..--.-"], ["$", "...-..-"]
];

Sob.createMorseEncoder = (...alphabets) => {
    let db = new Map;
    for (const alphabet of alphabets) {
        for (const [letter, signal] of alphabet) {
            db.set(letter.toUpperCase(), signal);
        }
    }
    return db;
};

Sob.createMorseDecoder = (...alphabets) => {
    let db = new Map;
    for (const alphabet of alphabets) {
        for (const [letter, signal] of alphabet) {
            db.set(signal, letter.toUpperCase());
        }
    }
    return db;
};

Sob.MORSE_SPACE_WORD = "0000000";
Sob.MORSE_SPACE_LETTER = "000";

Sob.morseExplode = (morse) => morse
        .split(MORSE_SPACE_WORD)
        .map(word => word.split(MORSE_SPACE_LETTER));

Sob.morseImplode = (morseWords) => morseWords
        .map(word => word.join(MORSE_SPACE_LETTER))
        .join(MORSE_SPACE_WORD);

Sob.morseImplodeDitDah = (morseWords) => {
    return morseWords.map(word => word.map(letter => {
        let ditdah = "";
        for (const chunk of letter.split("0")) {
            if (chunk == "1") {
                ditdah += ".";
            } else if (chunk == "111") {
                ditdah += "-";
            } else {
                // special case, should never happen
                ditdah += chunk.length;
            }
        }
    }).join(" ")).join(" / ");
};

Sob.morseEncode = (encoder, text) => {
    let morseWords = [];
    for (const word of Sob.stringToWords(text)) {
        let morseWord = [];
        for (const letter of Sob.stringToChars(word)) {
            const morseLetter = encoder.get(letter);
            if (morseLetter) {
                morseWord.push(morseLetter);
            }
        }
        morseWords.push(morseWord);
    }
};