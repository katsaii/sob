const getVerbose = () => true;
const getTextContent = () => document.getElementById("src").value;
const setTextContent = (text) => document.getElementById("src").value = text;
const setOutputContent = (text) => document.getElementById("dest").value = text;
const appendOutputContent = (text) => {
    const elem = document.getElementById("dest");
    if (elem.value) {
        elem.value += "\n" + text;
    } else {
        elem.value = text;
    }
};

const getMachineRatio = (throughput, craftTime, quantity) => {
    return new SobRational(throughput * craftTime, quantity);
};

const loadExample = (n) => {
    setTextContent(examples[n]);
    analyse();
};

let prevTextContent = undefined;
const analyse = () => {
    const textContent = getTextContent();
    if (textContent == prevTextContent) {
        return;
    }
    prevTextContent = textContent;
    const p = program.run(textContent);
    console.log(p);
    if (p.error) {
        setOutputContent(SobParseError.prettyPrint(p.error));
        return;
    }
    setOutputContent("");
    const typedefs = buildTypedefs(p.result.typedefs);
    const constraints = buildConstraints(typedefs, p.result.schemes);
    if (getVerbose()) {
        printConstraints(typedefs, constraints);
    }
};

const buildTypedefs = (typedefsAst) => {
    const mapToAtom = new Map;
    const mapFromAtom = new Map;
    for (const { name, value } of typedefsAst) {
        mapToAtom.set(name, value);
        mapFromAtom.set(value, name);
    }
    return {
        toAtom(name) { return mapToAtom.get(name) ?? name },
        fromAtom(atom) { return mapFromAtom.get(atom) ?? atom },
        fromAtomPretty(atom) {
            const name = mapFromAtom.get(atom);
            return name ? name : JSON.stringify(atom);
        },
    };
};

const buildConstraints = (typedefs, schemes) => {
    const constraints = [];
    for (const { name, inputs, duration, outputs } of schemes) {
        for (const i in outputs) {
            const out_ = outputs[i];
            constraints.push({
                output : typedefs.toAtom(out_.name),
                input : inputs.map(in_ => ({
                    value : typedefs.toAtom(in_.name),
                    amount : new SobRational(in_.amount, out_.amount),
                })),
                excess : outputs.filter((_, j) => i != j).map(out2 => ({
                    value : typedefs.toAtom(out2.name),
                    amount : new SobRational(out2.amount, out_.amount),
                })),
                duration : new SobRational(duration, out_.amount),
            })
        }
    }
    return constraints;
};

const printConstraints = (typedefs, constraints) => {
    appendOutputContent("constraints:\n");
    const showTypes = (types) => types
        .map(({ value, amount }) => `${amount}x ${typedefs.fromAtomPretty(value)}`)
        .join(" + ");
    for (const i in constraints) {
        const c = constraints[i];
        let line = "";
        line += `[${i}]: 1x ${typedefs.fromAtomPretty(c.output)}\t<=(${c.duration}s)=\t`;
        line += showTypes(c.input);
        if (c.excess.length > 0) {
            line += ` excess ${showTypes(c.excess)}`;
        }
        appendOutputContent(line);
    }
};

const solveConstraints = (typedefs, constraints) => {
    
};

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