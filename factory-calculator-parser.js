const P = SobParse;
const PErr = SobParseError;

const space = P.matchRegExp(/^(?:(?:#.*\n)|\s)*/);
const token = (parser) => P.keepFirst(parser, space);
const keyword = (name) => token(P.matchString(name));
const eof_ = P.matchRegExp(/^$/).map({
    onError : (_, src, idx) => new PErr("expected end of file", src, idx),
});

const ident = token(P.matchRegExp(/(?:^[A-Za-z_\-][A-Za-z0-9_\-]*)|(?:^`[^`]+`)/)).map({
    onResult : x => x.replace("`", ""),
    onError : (_, src, idx) => new PErr("expected identifier", src, idx),
});

const number = token(P.matchRegExp(/^-?[0-9_]+(\.[0-9_]+)?/).map({
    onResult : x => Number(x.replace("_", "")),
    onError : (_, src, idx) => new PErr("expected number", src, idx),
}));

const throughput = P.seq([
    keyword("throughput"),
    number,
    keyword("/"),
    keyword("s"),
]).map({
    onResult : x => x[1],
});

const declAtom = P.seq([
    keyword("atom"),
    ident,
    keyword("="),
    ident,
]).map({
    onResult : x => ({ kind : "atom", value : { name : x[1], value : x[3] } }),
});

const typeRes = P.either([
    ident.map({ onResult : (name) => ({ name, amount : 1 }) }),
    P.seq([number, keyword("x"), ident]).map({
        onResult : ([amount, , name]) => ({ name, amount }),
    }),
]);

const typeResMany = P.manyDelimitedBy(typeRes, keyword("+"));

const type = P.seq([
    typeResMany,
    keyword("=("),
    number,
    keyword("s"),
    keyword(")=>"),
    typeResMany,
]).map({
    onResult : ([inputs, , duration, , , outputs]) => ({ inputs, duration, outputs }),
});

const declRecipe = P.seq([
    ident,
    keyword(":"),
    type
]).map({
    onResult : ([name, , type_]) => ({ kind : "recipe", value : { name, ...type_ } }),
});

const decl = P.either([declAtom, declRecipe]);

const program = P.skipFirst(space, P.seq([
    throughput,
    P.many(decl),
    P.either([eof_, decl]), // the second `decl` makes it possible to report errors
])).map({
    onResult : x => {
        let throughput = x[0];
        const atoms = [];
        const recipes = [];
        for (const decl of x[1]) {
            switch (decl.kind) {
            case "atom":
                atoms.push(decl.value);
                break;
            case "recipe":
                recipes.push(decl.value);
                break;
            }
        }
        return { throughput, atoms, recipes };
    },
});