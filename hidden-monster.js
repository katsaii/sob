const getSrcContent = () => document.getElementById("src").value;
const setDestContent = (value) => document.getElementById("dest").value = value;

const base64Map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const charDirs = ["u", "r", "d", "l"]
const dirMap = [];
for (const fst of charDirs) {
    for (const snd of charDirs) {
        for (const thd of charDirs) {
            // fst = most significant
            // thd = least significant
            // base 4
            dirMap.push(fst + snd + thd);
        }
    }
}

const encode = () => {
    let output = [];
    for (const chr of sobStringToChars(getSrcContent())) {
        const val = base64Map.indexOf(chr);
        const dir = dirMap[val] ?? "???";
        console.log({ chr, val, dir });
        output.push(dir);
    }
    setDestContent(output.join(" "));
};

const decode = () => {
    let input = sobStringToChars(getSrcContent().replaceAll(/\s/g, ""));
    let output = "";
    for (let i = 0; i < input.length; i += 3) {
        const dir = input.slice(i, i + 3).reduce((lhs, rhs) => lhs + rhs);
        const val = dirMap.indexOf(dir);
        const chr = base64Map[val];
        console.log({ chr, val, dir });
        output += chr;
    }
    setDestContent(output);
};