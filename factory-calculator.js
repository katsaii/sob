/*

throughput 60/s

// aliases
atom bolt         = `-b-b-b-b-b-b`
atom circuit      = `-c-c-c-c-c-c`
atom construction = `-C-C-C-C-C-C`
atom wire         = `-w-w-w-w-w-w`

stamp-bolt         : `R---------R-`            =(9s)=>  3 * bolt
stamp-circuit      : `P-B-B-B-B-P-` + 3 * bolt =(15s)=> circuit
stamp-construction : 2 * bolt                  =(16s)=> 2 * construction
stamp-wire         : `P-B-B-B-B-P-`            =(10s)=> 5 * wire

stamp-circuit-ex   : 3 * wire + 2 * bolt + `R---------R-` + `P-B-B-B-B-P-` =(6s)=> 3 * circuit

---

3x a <= 1x b
1x c <= 1x d + 3x a
2x e <= 2x a

3x c <= 3x f + 2x a + 1x b + 1x d
5x f <= 1x d

---

a = 1/3x b
c = 1x d + 3x a
e = 1x a
c = 1x f + 2/3x a + 1/3x b + 1/3x d
f = 1/5x d

---

a = [1/3x b]
c = [1x d + 1x b, 8/15 d + 5/9x b]
e = [1/3x b]
f = [1/5x d]

*/

const space = sobPMatch(/(?:(?:#.*\n)|\s)*/);
const eof_ = sobPMap(sobPMatch(/^$/), { error : _ => "expected end of file" });
const token = (parser) => sobPKeepFirst(parser, space);

const ident = token(sobPMap(sobPMatch(/^(?:[A-Za-z_\-]+)|(?:`[^`]+`)/), {
    result : x => x.replace("`", ""),
    error : _ => "expected identifier" 
}));

const number = token(sobPMap(sobPMatch(/^-?[0-9_]+(\.[0-9_]+)?/), {
    result : x => Number(x.replace("_", "")),
    error : _ => "expected number",
}));

const parser = sobPKeepFirst(sobPSkipFirst(space, sobPSequence([
    ident,
    ident,
    number,
])), eof_);

const parseFactory = (src) => {
    return sobParse(parser, src);
};