const Sob = { };

Sob.stringToWords = (str) => str.match(/\b(\w+)\b/g);

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
            this.text += `</${tag}>`;
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