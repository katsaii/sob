const getTextContent = () => document.getElementById("src").value;
const setTextContent = (text) => document.getElementById("dest").value = text;

const caseConverter = ({ visit, join, skipPunct }) => () => {
    const text = getTextContent();
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
    skipPunct : false,
    visit : (_, value) => value.toUpperCase(),
});

const toLower = caseConverter({
    skipPunct : false,
    visit : (_, value) => value.toLowerCase(),
});

const titleArticles = { "the" : "the", "a" : "a", "an" : "an" };
const toTitle = () => {
    let isFirst = true;
    return (caseConverter({
        skipPunct : false,
        visit : (_, value) => {
            let valueArticle = titleArticles[value.toLowerCase()];
            value = valueArticle ?? value;
            let capitalise = isFirst || valueArticle == undefined;
            isFirst = false;
            if (capitalise) {
                return value[0].toUpperCase() + value.slice(1);
            } else {
                return value;
            }
        },
    }))();
};

const toCapitalised = caseConverter({
    skipPunct : false,
    visit : (_, value) => value[0].toUpperCase() + value.slice(1),
});

const toKebab = caseConverter({
    skipPunct : true,
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => values.join("-"),
});

const toCobol = caseConverter({
    skipPunct : true,
    visit : (_, value) => value.toUpperCase(),
    join : (_, values) => values.join("-"),
});

const toSnake = caseConverter({
    skipPunct : true,
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => values.join("_"),
});

const toScreamingSnake = caseConverter({
    skipPunct : true,
    visit : (_, value) => value.toUpperCase(),
    join : (_, values) => values.join("_"),
});

const toCamel = caseConverter({
    skipPunct : true,
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
    skipPunct : true,
    visit : (_, value) => value[0].toUpperCase() + value.slice(1),
    join : (_, values) => values.join(""),
});

const toFlat = caseConverter({
    skipPunct : true,
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => values.join(""),
});

const toScreaming = caseConverter({
    skipPunct : true,
    visit : (_, value) => value.toUpperCase(),
    join : (_, values) => values.join(""),
});

const toCamelSnake = caseConverter({
    skipPunct : true,
    visit : (_, value) => value.toLowerCase(),
    join : (_, values) => {
        let str = values[0];
        for (let i = 1; i < values.length; i += 1) {
            const value = values[i];
            str += "_";
            str += value[0].toUpperCase();
            str += value.slice(1);
        }
        return str;
    },
});

const toPascalSnake = caseConverter({
    skipPunct : true,
    visit : (_, value) => value[0].toUpperCase() + value.slice(1),
    join : (_, values) => values.join("_"),
});

const toTrain = caseConverter({
    skipPunct : true,
    visit : (_, value) => value[0].toUpperCase() + value.slice(1),
    join : (_, values) => values.join("-"),
});

const leetDigits = {
    "o" : "0", "l" : "1", "z" : "2",
    "e" : "3", "a" : "4", "s" : "5",
    // nothing for the number 6
    "t" : "7", "b" : "8", "g" : "9",
};
const toBasic1337 = caseConverter({
    skipPunct : false,
    visit : (_, value) => sobStringToChars(value)
            .map((chr) => leetDigits[chr.toLowerCase()] ?? chr)
            .join(""),
});

const toAlternating = caseConverter({
    skipPunct : false,
    visit : (_, value) => {
        let upper = true;
        return sobStringToChars(value)
            .map((chr) => {
                upper = !upper;
                return upper ? chr.toUpperCase() : chr;
            })
            .join("");
    },
});

const toUpperAlternating = caseConverter({
    skipPunct : false,
    visit : (_, value) => {
        let upper = false;
        return sobStringToChars(value)
            .map((chr) => {
                upper = !upper;
                return upper ? chr.toUpperCase() : chr;
            })
            .join("");
    },
});