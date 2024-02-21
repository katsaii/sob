const sobStatFrequencies = (xs) => {
    const db = new Map;
    for (const x of xs) {
        db.set(x, (db.get(x) ?? 0) + 1);
    }
    return Array.from(db).sort((lhs, rhs) => rhs[1] - lhs[1]);
};

const sobStatReverseInnerElements = (xs) => xs.map(x => x.reverse());