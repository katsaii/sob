const sobStringIsWhitespace = (str) => str != undefined && /[ \f\n\r\t\v\u00A0\u2028\u2029]/.test(str)

const sobStringIsAlphanum = (str) => str != undefined && /[A-Za-z0-9]/.test(str)

const sobStringIsAlphaUpper = (str) => str != undefined && /[A-Z]/.test(str)

const sobStringIsAlphaLower = (str) => str != undefined && /[a-z]/.test(str)

const sobStringIsNumeric = (str) => str != undefined && /[0-9]/.test(str)

const sobStringToWords = (str) => str.trim().split(/\s+/);

const sobStringToChars = Array.from;

const sobStringToUTF16 = (str) => {
    const utf16 = [];
    for (let i = 0; i < str.length; i += 1) {
        utf16.push(str.charCodeAt(i));
    }
    return utf16;
};

const sobStringToUTF8 = (str) => {
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

const sobStringSanitiseEscapes = (str) => {
    const chars = {
        "\n" : "\\n", "\r" : "\\r",
        "\f" : "\\f", "\t" : "\\t",
        "\b" : "\\b",
        "\"" : "\\\"", "\'" : "\\'",
    };
    return sobStringToChars(str).map(x => chars[x] ?? x).join("");
};

const sobStringShowList = (xs, each = undefined) => {
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

const sobStringVisit = (str, visitor = undefined, joiner = undefined) => {
    let offset = 0;
    const strLen = str.length;
    const peekChr = (n = 0) => offset + n < strLen ? str.charAt(offset + n) : undefined;
    const advance = (n = 1) => offset += n;
    const doVisit = (kind, value) => {
        if (visitor == undefined) {
            return value;
        }
        return visitor(kind, value);
    };
    const doJoin = (kind, values, defaultSeparator = "") => {
        values = values.filter((value) => value != undefined);
        if (values.length == 1) {
            return values[0];
        }
        if (joiner == undefined) {
            return values.join(defaultSeparator);
        }
        return joiner(kind, values, defaultSeparator);
    };
    const parseIdentTerminal = () => {
        let chr = peekChr();
        let str = "";
        if (chr != undefined) {
            advance();
            str += chr;
            let chrNext = peekChr();
            if (sobStringIsAlphaUpper(chr) && chrNext != undefined && sobStringIsAlphaUpper(chrNext)) {
                // for situations like "GUILayer" becoming "GUI" and "Layer"
                while (true) {
                    chr = peekChr(0);
                    if (chr == undefined || !sobStringIsAlphaUpper(chr)) {
                        break;
                    }
                    let chrNext = peekChr(1);
                    if (chrNext != undefined && sobStringIsAlphaLower(chrNext)) {
                        break;
                    }
                    str += chr;
                    advance();
                }
            } else if (sobStringIsNumeric(chr)) {
                // for numbers
                while (true) {
                    chr = peekChr();
                    if (chr == undefined || !sobStringIsNumeric(chr)) {
                        break;
                    }
                    str += chr;
                    advance();
                }
            } else {
                while (true) {
                    chr = peekChr();
                    if (chr == undefined || !sobStringIsAlphaLower(chr)) {
                        break;
                    }
                    str += chr;
                    advance();
                }
            }
        }
        return doVisit("word", str);
    };
    const parseIdentCamel = () => {
        let values = [parseIdentTerminal()];
        while (sobStringIsAlphanum(peekChr())) {
            values.push(parseIdentTerminal());
        }
        return doJoin("camel", values);
    };
    const parseIdentSnake = () => {
        let values = [parseIdentCamel()];
        while (peekChr() == "_") {
            advance();
            values.push(parseIdentCamel());
        }
        return doJoin("snake", values, "_");
    };
    const parseIdentKebab = () => {
        let values = [parseIdentSnake()];
        while (peekChr() == "-") {
            advance();
            values.push(parseIdentSnake());
        }
        return doJoin("kebab", values, "-");
    };
    const parseWhitespace = () => {
        let str = "";
        while (true) {
            const chr = peekChr();
            if (chr == undefined || !sobStringIsWhitespace(chr)) {
                break;
            }
            str += chr;
            advance();
        }
        return doVisit("whitespace", str);
    };
    const parseSentence = () => {
        let values = [];
        while (true) {
            const chr = peekChr();
            if (chr == undefined) {
                break;
            }
            if (sobStringIsWhitespace(chr)) {
                values.push(parseWhitespace());
            } else if (sobStringIsAlphanum(chr)) {
                values.push(parseIdentKebab());
            } else {
                advance();
                values.push(doVisit("other", chr));
            }
        }
        return doJoin("sentence", values);
    };
    return parseSentence();
};