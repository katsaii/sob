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
        const r = { };
        analyseResult = r;
        prevTextContent = textContent;
        r.p = program.run(textContent);
        if (r.p.error) {
            setOutputContent(SobParseError.prettyPrint(r.p.error));
            return;
        }
        setOutputContent("");
        r.typedefs = buildTypedefs(r.p.result.typedefs);
        r.constraints = buildConstraints(
            r.typedefs, r.p.result.throughput, r.p.result.schemes
        );
        appendOutputContent(`constraints:\n===========\n\n${
            sprintConstraints(r.typedefs, r.constraints)
        }\n`);
        r.solutions = buildSolutions(r.constraints);
        appendOutputContent(`solutions:\n===========\n\n${
            sprintSolutions(r.typedefs, r.solutions, 1)
        }\n`);
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
    const makeConstraint = (atom) => ({ atom, bounds : [] });
    for (const scheme of schemes) {
        for (const [i, output] of scheme.outputs.entries()) {
            const atom = typedefs.toAtom(output.name);
            const { bounds } = constraints.getOrInsertComputed(atom, makeConstraint);
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
    for (const [_, constraint] of constraints) {
        for (const bound of constraint.bounds) {
            lines.push(`[${lines.length}]: ${
                sprintAtomAmount(typedefs, { atom : constraint.atom })
            } ${
                sprintSignature(typedefs, bound.duration, bound.inputs, bound.excess)
            } {${bound.machineRatio}x ${bound.scheme}}`);
        }
    }
    return lines.join("\n");
};

const forEachPermutations = (items, f) => {
    const countMap = new Map(items);
    const countMax = countMap.values().reduce((lhs, rhs) => lhs * rhs, 1);
    for (let i = 0; i < countMax; i += 1) {
        f(items.map(([x, n]) => [x, i % n]));
    }
}

const buildSolutions = (constraints) => {
    const cache = new Map;
    const visited = new Set;
    const resolveConstraint = (constraint) => {
        let atom = constraint.atom;
        let solution = cache.get(atom);
        if (solution) {
            return solution;
        }
        let cacheIsValid = true;
        const resolveAtom = (atom) => {
            if (visited.has(atom)) {
                cacheIsValid = false;
                return undefined;
            }
            let constraint = constraints.get(atom);
            if (constraint) {
                return resolveConstraint(constraint);
            }
            return undefined;
        };
        // build solution variants from bounds
        visited.add(atom);
        const variants = constraint.bounds.map(bound => {
            const makeRational = _ => new SobRational(0, 1);
            // get inputs
            const shallowInputs = new Map; 
            for (const { atom, amount } of bound.inputs) {
                const fullAmount = shallowInputs.getOrInsertComputed(atom, makeRational);
                fullAmount.add(amount);
            }
            const inputSolutions = shallowInputs.keys().map(atom => {
                let solution = resolveAtom(atom);
                return [{ atom, solution }, solution ? solution.variants.length : 1];
            }).toArray();
            // produce all permutations of variants
            const variants = [];
            forEachPermutations(inputSolutions, inputSolutions => {
                const deepInputs = new Map;
                const deepExcess = new Map;
                for (const { atom, amount } of bound.excess) {
                    const fullAmount = deepExcess.getOrInsertComputed(atom, makeRational);
                    fullAmount.add(amount);
                }
                const path = inputSolutions.map(([{ atom, solution }, i]) => {
                    const inputAmount = shallowInputs.get(atom);
                    if (solution) {
                        const myVariant = solution.variants[i];
                        for (const [deepAtom, deepAmount] of myVariant.inputs) {
                            const fullAmount = deepInputs.getOrInsertComputed(deepAtom, makeRational);
                            fullAmount.add(new SobRational(deepAmount, 1).mult(inputAmount));
                        }
                        for (const [deepAtom, deepAmount] of myVariant.excess) {
                            const fullAmount = deepExcess.getOrInsertComputed(deepAtom, makeRational);
                            fullAmount.add(new SobRational(deepAmount, 1).mult(inputAmount));
                        }
                    } else {
                        const fullAmount = deepInputs.getOrInsertComputed(atom, makeRational);
                        fullAmount.add(inputAmount);
                    }
                    //const excessmount = deepExcess.getOrInsertComputed(atom, makeRational);
                    return { atom, solution, i };
                });
                variants.push({ constraint, bound, path, inputs : deepInputs, excess : deepExcess });
            });
            return variants;
        }).flat(1);
        visited.delete(atom);
        // cache solution if we can
        solution = { atom, variants };
        if (cacheIsValid) {
            cache.set(atom, solution);
        }
        return solution;
    };
    const solutions = new Map;
    for (const [atom, constraint] of constraints) {
        visited.clear();
        let solution = resolveConstraint(constraint);
        solutions.set(atom, solution);
    }
    return solutions;
};

const sprintSolutions = (typedefs, solutions, desired) => {
    const chunks = [];
    for (const [atom, solution] of solutions) {
        const atomName = typedefs.fromAtom(atom);
        const atomAmount = 1;
        let chunk = `to produce ${atomAmount}x ${
            atomName == atom ? atom : `${atomName} (${JSON.stringify(atom)})`
        }:`;
        if (solution.variants.length > 0) {
            chunk = `there are ${solution.variants.length} way(s) ` + chunk;
        } else {
            chunks.push("there are no ways " + chunk);
            continue;
        }
        const sprintVariantAmounts = (amounts) => {
            return sprintAtomAmountList(typedefs, amounts
                .entries()
                .map(([atom, amount]) => ({ atom, amount }))
                .toArray());
        };
        solution.variants.forEach((variant, i) => {
            const indentIdx = `  ${i + 1}. `;
            const indent = " ".repeat(indentIdx.length);
            chunk += `\n\n${indentIdx}(requires ${
                sprintVariantAmounts(variant.inputs)
            }`;
            if (variant.excess.size > 0) {
                chunk += `\n${indent}   excess ${sprintVariantAmounts(variant.excess)}`;
            }
            chunk += ")";
            const displayVariant = (variant, inAmount) => {
                for (const { atom, solution, i } of variant.path) {
                    if (solution) {
                        displayVariant(solution.variants[i], inAmount);
                    }
                }
                const bound = variant.bound;
                chunk += `\n${indent}. ${
                    sprintAtomAmountList(typedefs,
                        variant.bound.inputs.map(({ atom, amount }) => ({
                            atom, amount : amount.clone().mult(inAmount),
                        }))
                    )
                } -> [${
                    Math.max(1, Math.ceil(bound.machineRatio.clone().mult(inAmount)))
                }x ${bound.scheme}] -> ${
                    sprintAtomAmount(typedefs, {
                        atom : variant.constraint.atom,
                        amount : inAmount,
                    })
                }`;
            };
            displayVariant(variant, new SobRational(atomAmount));
        });
        chunks.push(chunk);
    }
    return chunks.join("\n\n");
};