//a.files[0].arrayBuffer().then(x => {
//    let tc = new TextDecoder("utf-8");
//    console.log(tc.decode(x));
//})
const getFileBuffer = () => document.getElementById("json-file").files[0];
const isNumeric = (n) => !isNaN(n);
const dec2bin = (dec) => (dec >>> 0).toString(2);

const bitFontIntoImage = () => getFileBuffer().text().then((text) => {
    const json = JSON.parse(text);
    for (const charCode in json) {
        if (!isNumeric(charCode)) {
            continue;
        }
        const char = String.fromCharCode(charCode);
        console.log(`"${charCode}" ${char}`);
        const frameData = json[charCode];
        let debugView = "";
        for (const line of frameData) {
            const bits = dec2bin(line);
            debugView += bits.padStart(16, "0").split("").reverse().join("") + "\n";
        }
        console.log(debugView.replaceAll("0", " ").replaceAll("1", "■"));
    }
});