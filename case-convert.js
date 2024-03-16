const getTextContent = () => document.getElementById("src").value;
const setTextContent = (text) => document.getElementById("dest").value = text;

const caseConverter = (f) => () => setTextContent(f(getTextContent()));

const toUpper = caseConverter((text) => text.toUpperCase());

const toLower = caseConverter((text) => text.toLowerCase());