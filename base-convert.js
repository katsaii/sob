const getSrcContent = () => document.getElementById("src-text").value;
const setSrcContent = (value) => document.getElementById("src-text").value = value;
const getDestContent = () => document.getElementById("dest-text").value;
const setDestContent = (value) => document.getElementById("dest-text").value = value;
const getBases = () => [
    Number(document.getElementById("src-base").value),
    Number(document.getElementById("dest-base").value)
];
const getAlphabet = () => {
    const alphabetElem = document.getElementById("alpha-text");
    return alphabetElem.value || alphabetElem.getAttribute("placeholder");
};
const getFriendly = () => document.getElementById(`check-friendly`).checked;
const getSimplified = () => document.getElementById(`check-simplify`).checked;

const outputResults = (value, srcBase, srcDigits, destBase, destDigits) => {
    if (value == 0) {
        document.getElementById("dest").innerHTML = "";
        return;
    }
    const encoder = getFriendly() ?
            sobBaseDigitsIntoPositionalCode :
            sobBaseDigitsIntoPositionalMath;
    const skipEmpty = getSimplified();
    const srcPos = encoder(srcBase, srcDigits, { skipEmpty });
    const destPos = encoder(destBase, destDigits, { skipEmpty });
    console.log("results");
    const srcResult = `${value} = ${srcPos}`;
    const destResult = `${value} = ${destPos}`;
    let sb = new SobHTMLBuilder;
    sb.writeResult(`base ${srcBase} positional notation`, srcResult);
    console.log(srcResult);
    if (srcBase != destBase) {
        sb.writeResult(`base ${destBase} positional notation`, destResult);
        console.log(destResult);
    }
    document.getElementById("dest").innerHTML = sb;
}

const srcIntoDest = () => {
    const [srcBase, destBase] = getBases();
    const alphabet = sobBaseCreateAlphabet(getAlphabet());
    const srcDigits = sobBaseDigitsParse(getSrcContent(), alphabet);
    const value = sobBaseDigitsIntoNumber(srcBase, srcDigits);
    const destDigits = sobBaseConvert(value, destBase);
    setDestContent(sobBaseDigitsStringify(destDigits, alphabet));
    outputResults(value, srcBase, srcDigits, destBase, destDigits);
};

const destIntoSrc = () => {
    const [srcBase, destBase] = getBases();
    const alphabet = sobBaseCreateAlphabet(getAlphabet());
    const destDigits = sobBaseDigitsParse(getDestContent(), alphabet);
    const value = sobBaseDigitsIntoNumber(destBase, destDigits);
    const srcDigits = sobBaseConvert(value, srcBase);
    setSrcContent(sobBaseDigitsStringify(srcDigits, alphabet));
    outputResults(value, srcBase, srcDigits, destBase, destDigits);
};