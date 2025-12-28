class SobParseError extends Error {
    constructor(message, src, idx, options = undefined) {
        super(message, options);
        this.src = src;
        this.idx = idx;
    }

    toString = () => {
        // find line start
        let iStart = this.idx;
        while (iStart > 0 && /\s/.test(this.src[iStart])) {
            iStart -= 1;
        }
        while (iStart > 0 && this.src[iStart - 1] != "\n") {
            iStart -= 1;
        }
        // find line end
        let iEnd = this.idx;
        while (iEnd < this.src.length && this.src[iEnd] != "\n") {
            iEnd += 1;
        }
        return `
error: ${this.message}
  got: ${this.src.slice(iStart, iEnd)}
       ${" ".repeat(this.idx - iStart)}^ [${this.idx}]
        `.trim();
    };

    static prettyPrint = (error) => {
        if (error instanceof SobParseError) {
            return error.toString();
        } else if (error instanceof AggregateError) {
            let errors = [];
            for (const suberror of error.errors) {
                errors.push(SobParseError.prettyPrint(suberror));
            }
            return errors.join("\n\n");
        } else if (error instanceof Error) {
            return `error: (${error.name}) ${error.message}`;
        } else {
            return `error: ${error}`;
        }
    };
}

class SobParse {
    constructor(parselet) {
        this.fn = parselet;
    }

    run = (src) => this.fn({ src, idx : 0, result : null, error : null });

    static _makeErr = (p, error) => ({ ...p, error });
    static _makeErrMessage = (p, message) => ({ ...p, error : new SobParseError(message, p.src, p.idx) });
    static _makeOk = (p, result, idx = p.idx) => ({ ...p, result, idx });

    map = ({ onResult, onError }) => new SobParse((p) => {
        if (p.error) { return p }
        p = this.fn(p);
        if (p.error) {
            return onError ? SobParse._makeErr(p, onError(p.error, p.src, p.idx)) : p;
        } else {
            return onResult ? SobParse._makeOk(p, onResult(p.result)) : p;
        }
    });

    static matchString = (expect) => new SobParse((p) => {
        if (p.error) { return p }
        let got = p.src.slice(p.idx, p.idx + expect.length);
        if (expect == got) {
            return SobParse._makeOk(p, got, p.idx + got.length);
        }
        return SobParse._makeErrMessage(p, `expected '${expect}'`);
    });

    static matchRegExp = (regexp, group = 0) => new SobParse((p) => {
        if (p.error) { return p }
        let match = p.src.slice(p.idx).match(regexp);
        if (match) {
            return SobParse._makeOk(p, match[group], p.idx + match.index + match[group].length);
        }
        return SobParse._makeErrMessage(p, `expected string matching ${regexp}`);
    });

    static skipFirst = (prefix, suffix) => new SobParse((p) => {
        if (p.error) { return p }
        p = prefix.fn(p);
        if (p.error) { return p }
        p = suffix.fn(p);
        let result = p.result;
        if (p.error) { return p }
        return SobParse._makeOk(p, result);
    });

    static keepFirst = (prefix, suffix) => new SobParse((p) => {
        if (p.error) { return p }
        p = prefix.fn(p);
        let result = p.result;
        if (p.error) { return p }
        p = suffix.fn(p);
        if (p.error) { return p }
        return SobParse._makeOk(p, result);
    });

    static many = (parser) => new SobParse((p) => {
        if (p.error) { return p }
        const result = [];
        let done = false;
        while (!done) {
            let pNext = parser.fn(p);
            if (pNext.error) {
                done = true;
            } else {
                p = pNext;
                result.push(p.result);
            }
        }
        return SobParse._makeOk(p, result);
    });

    static manyDelimitedBy = (parser, delimiter) => {
        return SobParse.seq([
            SobParse.many(SobParse.keepFirst(parser, delimiter)),
            parser,
        ]).map({ onResult : ([xs, x]) => [...xs, x] });
    };

    static optional = (parser) => new SobParse((p) => {
        if (p.error) { return p }
        const pNext = parser.fn(p);
        return pNext.error ? SobParse._makeOk(p, undefined) : pNext;
    });

    static either = (parsers) => new SobParse((p) => {
        if (p.error) { return p }
        const errors = [];
        for (let parser of parsers) {
            let p2 = parser.fn(p);
            if (!p2.error) { return p2 }
            errors.push(p2.error);
        }
        if (errors.length < 1) {
            return SobParse._makeErrMessage(p, "failed to match either");
        } else {
            return SobParse._makeErr(p, errors[errors.length - 1]);
        }
    });

    static seq = (parsers) => new SobParse((p) => {
        const result = [];
        for (let parser of parsers) {
            if (p.error) { return p }
            p = parser.fn(p);
            result.push(p.result);
        }
        return SobParse._makeOk(p, result);
    });
}