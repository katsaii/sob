const sobStringToWords = (str) => str.trim().split(/\s+/);

const sobStringToChars = (str) => Array.from(str);

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