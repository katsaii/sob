const getSrcContent = () => document.getElementById("src-text").value;
const setSrcContent = (value) => document.getElementById("src-text").value = value;
const getDestContent = () => document.getElementById("dest-text").value;
const setDestContent = (value) => document.getElementById("dest-text").value = value;
const getBases = () => [
    document.getElementById("src-base").value,
    document.getElementById("dest-base").value
];

const sobMathEuclidDivision = (dividend, divisor) => {
    // ensures that the remainder is always a non-negative integer
    let q = Math.floor(dividend / divisor);
    let r = (dividend % divisor + divisor) % divisor;
    if (r < 0) {
        q -= Math.sign(divisor);
        r += Math.abs(divisor);
    }
    return [q, r];
};

const sobMathEuclidDivisionArr = (x * b^2 + y * b^1 + z * b^0, divisor) => {
    // ensures that the remainder is always a non-negative integer
    let q = Math.floor((x / divisor) * b^2 + (y / divisor) * b^1 + (z / divisor) * b^0);
    let r = ((x * b^2 + y * b^1 + z * b^0) % divisor + divisor) % divisor;
    if (r < 0) {
        q -= Math.sign(divisor);
        r += Math.abs(divisor);
    }
    return [q, r];
};

const sobBaseParseBigInt = (base, text, alphabet) => {
    
};

const sobBaseStringifyBigInt = (baseIn, baseOut, digits) => {
    if (baseIn == baseOut) {
        return digits;
    }
    return digits;
};

const destIntoSrc = () => {
    const [baseSrc, baseDest] = getBases();
};

const srcIntoDest = () => {
    const [baseSrc, baseDest] = getBases();
};