const P = SobParse;
const PErr = SobParseError;

const space = P.matchRegExp(/^(?:(?:#.*\n?)|\s)*/);
const token = (parser) => P.skipFirst(space, parser);
const keyword = (name) => token(P.matchString(name));
const eof_ = P.skipFirst(space, P.matchRegExp(/^$/)).map({
    onError : (_, src, idx) => new PErr("expected end of file", src, idx),
});

const ident = token(P.matchRegExp(/(?:^[A-Za-z_\-][A-Za-z0-9_\-]*)|(?:^`[^`]+`)/)).map({
    onResult : x => x.replaceAll("`", ""),
    onError : (_, src, idx) => new PErr("expected identifier", src, idx),
});

const string = token(P.matchRegExp(/^"[^"]*"/).map({
    onResult : x => x.slice(1, x.length - 1),
    onError : (_, src, idx) => new PErr("expected string", src, idx),
}));

const numberInt = token(P.matchRegExp(/^-?[0-9][0-9_]*/).map({
    onResult : x => Number(x.replace("_", "")),
    onError : (_, src, idx) => new PErr("expected number", src, idx),
}));

const number = P.either([
    P.seq([numberInt, keyword("/"), numberInt]).map({
        onResult : ([n, , m]) => new SobRational(n, m),
    }),
    P.seq([numberInt, keyword("."), numberInt]).map({
        onResult : ([n, , dec]) => {
            if (dec == 0) {
                return new SobRational(n);
            }
            const decLength = dec.toString().length;
            return new SobRational(n * Math.pow(10, decLength) + dec, decLength);
        }
    }),
    numberInt.map({ onResult : n => new SobRational(n) }),
]);

const unit = ident;

const throughput = P.seq([
    keyword("throughput"),
    number,
    keyword("per"),
    unit,
]).map({ onResult : ([, amount, , unit]) => ({ amount, unit }) });

const typeValue = P.either([ident, string]);

const declTypedef = P.seq([
    keyword("type"),
    ident,
    keyword("="),
    typeValue,
]).map({
    onResult : ([, name, , value]) => ({ kind : "typedef", value : { name, value } }),
});

const typeRes = P.either([
    typeValue.map({ onResult : (name) => ({ name, amount : new SobRational(1) }) }),
    P.seq([number, keyword("x"), typeValue]).map({
        onResult : ([amount, , name]) => ({ name, amount }),
    }),
]);

const typeResMany = P.either([
    keyword("nothing").map({ onResult : _ => [] }),
    P.manyDelimitedBy(typeRes, keyword("+")),
]);

const typeDuration = P.either([
    P.seq([
        keyword("=("),
        number,
        P.optional(unit),
        keyword(")=>"),
    ]).map({ onResult : ([, amount, unit,]) => ({ amount, unit }) }),
    keyword("==>").map({ onResult : _ => ({ amount : new SobRational(0), unit : undefined }) }),
])

const type = P.seq([
    typeResMany,
    typeDuration,
    typeResMany,
]).map({
    onResult : ([inputs, duration, outputs]) => ({ inputs, duration, outputs }),
});

const declScheme = P.seq([
    ident,
    keyword(":"),
    type
]).map({
    onResult : ([name, , type_]) => ({ kind : "scheme", value : { name, ...type_ } }),
});

const decl = P.either([declTypedef, declScheme]);

const program = P.seq([
    P.optional(throughput),
    P.many(decl),
    P.either([eof_, decl]), // the second `decl` makes it possible to report errors
]).map({
    onResult : ([throughput = { amount : new SobRational(1), unit : "u" }, decls, ]) => {
        const typedefs = [];
        const schemes = [];
        for (const decl of decls) {
            switch (decl.kind) {
            case "typedef":
                typedefs.push(decl.value);
                break;
            case "scheme":
                schemes.push(decl.value);
                break;
            }
        }
        return { throughput, typedefs, schemes };
    },
});