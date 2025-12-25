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
let analyseResult = { };
const analyse = () => {
    try {
        const textContent = getTextContent();
        if (textContent == prevTextContent) {
            return;
        }
        analyseResult = { };
        prevTextContent = textContent;
        const p = program.run(textContent);
        if (getVerbose()) {
            analyseResult.p = p;
        }
        if (p.error) {
            setOutputContent(SobParseError.prettyPrint(p.error));
            return;
        }
        setOutputContent("");
        const typedefs = buildTypedefs(p.result.typedefs);
        const constraints = buildConstraints(typedefs, p.result.throughput, p.result.schemes);
        if (getVerbose()) {
            analyseResult.typedefs = typedefs;
            analyseResult.constraints = constraints;
            appendOutputContent(`constraints:\n===========\n\n${
                sprintConstraints(typedefs, constraints)
            }\n\n`);
        }
    } catch (ex) {
        setOutputContent(`oh no! encountered an exception:\n\n${ex}`);
        console.error(ex);
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

const buildConstraints = (typedefs, throughput, schemes) => {
    const constraints = new Map;
    for (const scheme of schemes) {
        for (const [i, output] of scheme.outputs.entries()) {
            const atom = typedefs.toAtom(output.name);
            const { bounds } = constraints.getOrInsert(atom, { atom, bounds : [] });
            bounds.push({
                scheme : scheme.name,
                machineRatio : new SobRational(scheme.duration, output.amount).multN(throughput),
                duration : scheme.duration,
                inputs : scheme.inputs.map(input => ({
                    atom : typedefs.toAtom(input.name),
                    amount : new SobRational(input.amount, output.amount),
                })),
                excess : scheme.outputs.filter((_, j) => i != j).map(other => ({
                    atom : typedefs.toAtom(other.name),
                    amount : new SobRational(other.amount, output.amount),
                })),
            });
        }
    }
    return constraints;
};

const sprintAtomAmount = (typedefs, { atom, amount = 1 }) => {
    let type = typedefs.fromAtomPretty(atom);
    return amount.valueOf() == 1 ? type : `${amount}x ${type}`;
};

const sprintAtomAmountList = (typedefs, atoms) => {
    if (atoms.length > 0) {
        return atoms.map(x => sprintAtomAmount(typedefs, x)).join(" + ");
    } else {
        return "nothing";
    };
};

const sprintSignature = (typedefs, duration, inputs, excess) => {
    let out = `<=(${duration}s)= ${sprintAtomAmountList(typedefs, inputs)}`;
    if (excess.length > 0) {
        out += ` excess ${sprintAtomAmountList(typedefs, excess)}`;
    }
    return out;
};

const sprintConstraints = (typedefs, constraints) => {
    let lines = [];
    for (const [atom, constraint] of constraints.entries()) {
        for (const bound of constraint.bounds) {
            lines.push(`[${lines.length}]: ${
                sprintAtomAmount(typedefs, { atom })
            } ${
                sprintSignature(typedefs, bound.duration, bound.inputs, bound.excess)
            } {${bound.machineRatio}x ${bound.scheme}}`);
        }
    }
    return lines.join("\n");
};

const resolveConstraints = (typedefs, types) => {
    /*
    return [
        {
            name : "a",
            variants : [
                // small step semantics
                process : [
                    { scheme : "stamp-a", duration : 2, inputs : [{ name : "b", amount : 2 }], excess : [] },
                ],
                // big step semantics
                duration : 2,
                inputs : [{ name : "b", amount : 2 }],
                excess : [],
            ],
        }
    ]
    */
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

/*

a = 2x a

---

a = [2x a]

---

a = 2x 'a as 'a

*/