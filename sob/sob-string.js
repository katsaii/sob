const sobStringIsWhitespace = (str) => /[ \f\n\r\t\v\u00A0\u2028\u2029]/.test(str)

const sobStringIsAlphanum = (str) => /[A-Za-z0-9]/.test(str)

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

const sobStringVisit = (str, visitor, joiner = undefined) => {
    let offset = 0;
    const strLen = str.length;
    const peekChr = (n = 0) => offset + n < strLen ? str.charAt(offset + n) : undefined;
    const advance = (n = 0) => offset += n;
    const doVisit = (kind, value) => {
        if (visitor == undefined) {
            return value;
        }
        return visitor(kind, value);
    };
    const doJoin = (kind, values) => {
        if (joiner == undefined) {
            return values.join("");
        }
        return joiner(kind, values);
    };
    const parseWord = () => {

    };
    const parseWhitespace = () => {

    };
    const parseOther = () => {
        const chr = peekChr();
        advance();
        return visitor("other", chr);
    };
    const parseSentence = () => {
        let values = [];
        while (true) {
            const chr = peekChr();
            if (chr == undefined) {
                break;
            }
        }
        return doJoin("sentence", values);
    };


    let segments = [];
    const getCharKind = (chr) => {
        if (sobStringIsWhitespace(chr)) { return "whitespace" }
        if (sobStringIsAlphanum(chr)) { return "alphanum" }
        return "other";
    };
    let currentSegment = undefined;
    for (let i = 0; i < str.length; i += 1) {
        const chr = str.charAt(i);
        const chrKind = getCharKind(chr);
        if (currentSegment != undefined && chrKind != currentSegment.kind) {
            segments.push(currentSegment);
            currentSegment = undefined;
        }
        if (currentSegment == undefined) {
            currentSegment = {
                str : chr,
                offset : i,
                kind : chrKind,
            };
            continue;
        }
        currentSegment.str += chr;
    }
    if (currentSegment != undefined) {
        segments.push(currentSegment);
    }
    return segments;
};