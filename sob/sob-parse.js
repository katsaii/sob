// parser combinator loosely inspired by https://youtu.be/1axJDmK_pnE

const sobParseResult = (p, result, idx = p.idx) => ({ ...p, result, idx });
const sobParseError = (p, error) => ({ ...p, error });
const sobParse = (parser, src) => parser({ src, idx : 0, result : null, error : null });

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

const sobPSequence = (parsers) => (p) => {
    const result = [];
    for (let parser of parsers) {
        if (p.error != null) { return p }
        p = parser(p);
        result.push(p.result);
    }
    return sobParseResult(p, result);
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

const sobPAlternative = (parsers) => (p) => {
    if (p.error != null) { return p }
    const error = [];
    for (let parser of parsers) {
        let p2 = parser(p);
        if (p2.error != null) { return p2 }
        error.push(p2.error);
    }
    return sobParseError(p, error);
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