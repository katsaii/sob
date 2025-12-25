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

const number = token(P.matchRegExp(/^-?[0-9_]+(\.[0-9_]+)?/).map({
    onResult : x => Number(x.replace("_", "")),
    onError : (_, src, idx) => new PErr("expected number", src, idx),
}));

const numberRational = P.either([
    P.seq([number, keyword("/"), number]).map({
        onResult : ([n, , m]) => new SobRational(n, m),
    }),
    number,
]);

const throughput = P.seq([
    keyword("throughput"),
    number,
    keyword("/"),
    keyword("s"),
]).map({
    onResult : x => x[1],
});

const typeValue = P.either([ident, string]);

const declTypedef = P.seq([
    keyword("type"),
    ident,
    keyword("="),
    typeValue,
]).map({
    onResult : x => ({ kind : "typedef", value : { name : x[1], value : x[3] } }),
});

const typeRes = P.either([
    typeValue.map({ onResult : (name) => ({ name, amount : 1 }) }),
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
        numberRational,
        keyword("s"),
        keyword(")=>"),
    ]).map({ onResult : ([, duration, ]) => duration }),
    keyword("==>").map({ onResult : _ => 0 }),
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
    throughput,
    P.many(decl),
    P.either([eof_, decl]), // the second `decl` makes it possible to report errors
]).map({
    onResult : x => {
        let throughput = x[0];
        const typedefs = [];
        const schemes = [];
        for (const decl of x[1]) {
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