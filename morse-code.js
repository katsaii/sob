const getTextContent = () => document.getElementById("src").value;
const setTextContent = (value) => document.getElementById("dest").value = value;
const getSelection = () => document.getElementById("lang-select").value;
const getOption = (id) => document.getElementById(`check-${id}`).checked;

const morseInternational = [
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

const morseNonLatin = [

];

const morseNumbers = [
    ["1", ".----"], ["2", "..---"],
    ["3", "...--"], ["4", "....-"],
    ["5", "....."], ["6", "-...."],
    ["7", "--..."], ["8", "---.."],
    ["9", "----."], ["0", "-----"],
];

const morsePunctuation = [
    [".", ".-.-.-"], [",", "--..--"], ["?", "..--.."],
    ["'", ".----."], ["/", "-..-."],  ["(", "-.--."],
    [")", "-.--.-"], [":", "---..."], ["=", "-...-"],
    ["+", ".-.-."],  ["-", "-....-"], ["\"", ".-..-."],
    ["@", ".--.-."],
];

const morseNonStandard = [
    ["!", "-.-.--"], ["&", ".-..."], [";", "-.-.-."],
    ["_", "..--.-"], ["$", "...-..-"]
];

const getDatabase = () => {
    let db = [];
    switch (getSelection()) {
    case "international-non-latin":
        db.push(...morseNonLatin);
    case "international":
        db.push(...morseInternational);
        break;
    }
    if (getOption("numbers")) {
        db.push(...morseNumbers);
    }
    if (getOption("punctuation")) {
        db.push(...morsePunctuation);
    }
    if (getOption("non-standard")) {
        db.push(...morseNonStandard);
    }
    return db;
}

function encodeMorse() {
    const text = getTextContent();
    const words = Sob.stringToWords(text);
    const db = new Map(getDatabase());
    let morseWords = [];
    for (const word of words) {
        let morseChars = [];
        const chars = Sob.stringToChars(word);
        for (const char of chars) {
            const code = db.get(char.toUpperCase()) ?? "?";
            morseChars.push(code);
        }
        if (morseChars.length > 0) {
            morseWords.push(morseChars.join(" "));
        }
    }
    setTextContent(morseWords.join(" / "));
}

function decodeMorse() {

}