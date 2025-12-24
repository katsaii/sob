// parser combinator loosely inspired by https://youtu.be/1axJDmK_pnE

const sobParseResult = (p, result, idx = p.idx) => ({ ...p, result, idx });
const sobParseError = (p, error) => ({ ...p, error });
const sobParse = (parser, src) => parser({ src, idx : 0, result : null, error : null });
const sobParseGetErrorMessage = (p) => {
    if (p.error == null) {
        return null;
    }
    let msg = "";
    for (const error of (typeof p.error == "string" ? [p.error] : p.error)) {
        msg += `error: ${error}\n`;
    }
    // find line start
    let iStart = p.idx;
    while (iStart > 0 && /\s/.test(p.src[iStart])) {
        iStart -= 1;
    }
    while (iStart > 0 && p.src[iStart - 1] != "\n") {
        iStart -= 1;
    }
    // find line end
    let iEnd = p.idx;
    while (iEnd < p.src.length && p.src[iEnd] != "\n") {
        iEnd += 1;
    }
    msg += `  got: ${p.src.slice(iStart, iEnd)}\n`;
    msg += `       ${" ".repeat(p.idx - iStart)}^ (at index ${p.idx})`;
    return msg;
};

const sobPMatch = (expect, group = 0) => (p) => {
    if (p.error != null) { return p }
    let srcSlice = p.src.slice(p.idx);
    let match = srcSlice.match(expect);
    if (match) {
        return sobParseResult(p, match[group], p.idx + match.index + match[group].length);
    }
    if (typeof expect == "string") {
        return sobParseError(p, `expected '${expect}'`);
    } else {
        return sobParseError(p, `expected string matching ${expect}`);
    }
};

const sobPSkipFirst = (prefix, suffix) => (p) => {
    if (p.error != null) { return p }
    p = prefix(p);
    if (p.error != null) { return p }
    p = suffix(p);
    let result = p.result;
    if (p.error != null) { return p }
    return sobParseResult(p, result);
};

const sobPKeepFirst = (prefix, suffix) => (p) => {
    if (p.error != null) { return p }
    p = prefix(p);
    let result = p.result;
    if (p.error != null) { return p }
    p = suffix(p);
    if (p.error != null) { return p }
    return sobParseResult(p, result);
};

const sobPMany = (parser) => (p) => {
    if (p.error != null) { return p }
    const result = [];
    while (true) {
        let p2 = parser(p);
        if (p2.error != null) {
            break;
        }
        p = p2;
        result.push(p.result);
    }
    return sobParseResult(p, result);
};

const sobPSeq = (parsers) => (p) => {
    const result = [];
    for (let parser of parsers) {
        if (p.error != null) { return p }
        p = parser(p);
        result.push(p.result);
    }
    return sobParseResult(p, result);
};

const sobPAlt = (parsers) => (p) => {
    if (p.error != null) { return p }
    const error = [];
    for (let parser of parsers) {
        let p2 = parser(p);
        if (p2.error == null) { return p2 }
        error.push(p2.error);
    }
    return sobParseError(p, error.join(", or "));
};

const sobPMap = (parser, { result, error }) => (p) => {
    if (p.error != null) { return p }
    p = parser(p);
    if (p.error == null) {
        return sobParseResult(p, result?.(p.result) ?? p.result);
    } else {
        return sobParseError(p, error?.(p.error) ?? p.error);
    }
};