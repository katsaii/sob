const getFunds = () => Number(document.getElementById("n-total").value);
const setFunds = (n) => document.getElementById("n-total").value = n;
const getFundsExtra = () => Number(document.getElementById("n-extra").value);
const setFundsExtra = (n) => document.getElementById("n-extra").value = n;
const getFundsPerMonth = () => Number(document.getElementById("n-per-month").value);
const setFundsPerMonth = (n) => document.getElementById("n-per-month").value = n;

let timestamp = new Date();
let monthsPassed = 0;
const updateTimestamp = (prev, curr) => {
    document.getElementById("n-timestamp").innerHTML = `last access: <code>${prev}</code>`;
    const diffYear = curr.getFullYear() - prev.getFullYear();
    const diffMonth = curr.getMonth() - prev.getMonth();
    const monthsPassed = diffYear * 12 + diffMonth;
    console.log(`diff year: ${curr.getFullYear()} - ${prev.getFullYear()} = ${diffYear}`);
    console.log(`diff months: ${curr.getMonth()} - ${prev.getMonth()} = ${diffMonth}`);
    console.log(`months passed: ${monthsPassed}`);
    timestamp = curr;
    // update funds by number of months passed
    setFunds(getFunds() + monthsPassed * getFundsPerMonth())
};

const importPot = () => document.getElementById("pot-import").click();
const importPotLoaded = () => {
    document.getElementById("pot-import").files[0].text().then((text) => {
        try {
            const json = JSON.parse(text);
            setFunds(json["value"]);
            setFundsPerMonth(json["per-month"]);
            updateTimestamp(new Date(json["timestamp"]), timestamp);
        } catch (ex) {
            alert(`failed to load pot: ${ex.message}`);
        }
        validateInput();
    });
};

let dlLink = undefined;
const exportPot = () => {
    if (dlLink == undefined) {
        dlLink = document.createElement("a");
    }
    const file = new Blob([
`{
  "value": "${getFunds()}",
  "per-month": "${getFundsPerMonth()}",
  "timestamp": "${timestamp}"
}`
    ], { type: "application/json" });
    dlLink.href = URL.createObjectURL(file);
    dlLink.download = "pot.json";
    dlLink.click();
    URL.revokeObjectURL(dlLink.href);
};

const clearPot = () => {
    document.getElementById("n-timestamp").innerHTML = "";
    setFunds(0);
    setFundsExtra(0);
    setFundsPerMonth(0);
    validateInput();
};

const addFunds = () => {
    setFunds(getFunds() + getFundsExtra());
    validateInput();
}

const removeFunds = () => {
    setFunds(getFunds() - getFundsExtra());
    validateInput();
};

const validateInput = () => {
    document.getElementById("n-not-positive").innerText = getFundsExtra() < 0
        ? "value to add/remove should not be negative!"
        : "";
    document.getElementById("n-debt").innerText = getFunds() < 0
        ? "you have negative funds!"
        : "";
    document.getElementById("n-too-much").innerText = getFundsPerMonth() >= 100
        ? "this seems like too much per month..."
        : getFundsPerMonth() < 0
        ? "value to add per month should not be negative!"
        : "";
};

document.addEventListener("DOMContentLoaded",function() {
    clearPot();
    document.querySelector("#n-extra").onchange = validateInput;
    document.querySelector("#n-per-month").onchange = validateInput;
    document.querySelector("#pot-import").onchange = importPotLoaded;
}, false);