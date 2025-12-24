const getTextContent = () => document.getElementById("src").value;
const setTextContent = (text) => document.getElementById("src").value = text;

const getMachineRatio = (throughput, craftTime, quantity) => {
    return new SobRational(throughput * craftTime, quantity);
};

const parseFactory = (src) => {
    let p = program.run(src);
    if (p.error) {
        console.log(SobParseError.prettyPrint(p.error));
    }
    return p.result;
};

const analyse = () => {
    console.log(parseFactory(getTextContent()));
}

/*

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