const getTextContent = () => document.getElementById("src").value;
const setTextContent = (text) => document.getElementById("dest").value = text;
const getSkipPunctuation = () => document.getElementById("check-punctuation").checked;

const caseConverter = ({ visit, join }) => () => {
    const text = getTextContent();
    const skipPunct = getSkipPunctuation();
    const newText = sobStringVisit(text,
        (kind, value) => {
            if ((kind == "whitespace" || kind == "other") && skipPunct) {
                return undefined;
            }
            if (visit == undefined) {
                return value;
            }
            return visit(kind, value);
        },
        (kind, values, defaultSeparator) => {
            if (skipPunct) {
                defaultSeparator = "";
            }
            if (join == undefined || kind == "sentence" && !skipPunct) {
                return values.join(defaultSeparator);
            }
            return join(kind, values, defaultSeparator);
        }
    );
    setTextContent(newText)
};

const toUpper = caseConverter({
    visit : (_, value) => value.toUpperCase(),
});

const toLower = caseConverter({
    visit : (_, value) => value.toLowerCase(),
});

const toKebab = caseConverter({
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => values.join("-"),
});

const toCobol = caseConverter({
    visit : (_, value) => value.toUpperCase(),
    join : (_, values) => values.join("-"),
});

const toSnake = caseConverter({
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => values.join("_"),
});

const toScreamingSnake = caseConverter({
    visit : (_, value) => value.toUpperCase(),
    join : (_, values) => values.join("_"),
});

const toCamel = caseConverter({
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => {
        let str = values[0];
        for (let i = 1; i < values.length; i += 1) {
            const value = values[i];
            str += value[0].toUpperCase();
            str += value.slice(1);
        }
        return str;
    },
});

const toPascal = caseConverter({
    visit : (_, value) => value[0].toUpperCase() + value.slice(1),
    join : (_, values) => values.join(""),
});

const toPackage = caseConverter({
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => values.join(""),
});


const leetDigits = {
    "o" : "0", "l" : "1", "z" : "2",
    "e" : "3", "a" : "4", "s" : "5",
    // nothing for the number 6
    "t" : "7", "b" : "8", "g" : "9",
}
const toBasic1337 = caseConverter({
    visit : (_, value) => sobStringToChars(value)
            .map((chr) => leetDigits[chr.toLowerCase()] ?? chr)
            .join(""),
});