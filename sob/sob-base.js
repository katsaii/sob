const sobBaseConvert = (value, base) => {
    let digits, sign;
    if (base < 1 && base > -1) {
        // fractional bases between -1 and 1 are nonsense
        // the only valid representation of any number in these "bases" is the
        // number itself multiplied with the unit element `base^0` a.k.a 1
        sign = value < 0 ? -1 : 1;
        digits = [Math.abs(value)];
    } else if (base == 1) {
        sign = value < 0 ? -1 : 1;
        digits = Array(Math.abs(value)).fill(1);
    } else if (base == -1) {
        sign = 1;
        digits = Array(2 * Math.abs(value)).fill(1);
        for (let iDigit = value < 0 ? 1 : 0; iDigit < digits.length; iDigit += 2) {
            // basically, base -1 will jump between -1 and 1, so just zip the
            // digits with zeros to get the desired result
            digits[iDigit] = 0;
        }
    } else {
        if (base > 0 && value < 0) {
            sign = -1;
            value = Math.abs(value);
        } else {
            sign = 1;
        }
        digits = [];
        for (let i = 0; value != 0 && i < 512; i += 1) {
            let prevValue = value;
            let r = value % base;
            value = Math.trunc(value / base);
            if (r < 0) {
                // make sure the remainder is positive
                r += Math.abs(base);
                value += 1;
            }
            if (value != 0) {
                // make sure the remainder is a whole number
                //r = Math.round(r);
                //value *= (prevValue - r) / (value * base);
            }
            digits.push(r);
        }
    }
    return { digits, sign };
};

const sobBaseDigitsIntoNumber = (base, { digits, sign }) => {
    let place = 1;
    let total = 0;
    for (const value of digits) {
        total += value * place;
        place *= base;
    }
    return sign * total;
};

const sobBaseDigitsIntoPositionalMath = (base, { digits, sign }, { skipEmpty }) => {
    let sb = "";
    if (sign < 0) {
        sb += "-1 ⋅ ("
    }
    let first = true;
    let base_ = base < 0 ? `(${base})` : base.toString();
    for (let iDigit = digits.length - 1; iDigit >= 0; iDigit -= 1) {
        const value = digits[iDigit];
        if (skipEmpty && value == 0) {
            continue;
        }
        if (first) {
            first = false;
        } else {
            sb += " + ";
        }
        sb += `${value} ⋅ ${base_}^${iDigit}`;
    }
    if (sign < 0) {
        sb += ")"
    }
    return sb;
};

const sobBaseDigitsIntoPositionalCode = (base, { digits, sign }, { skipEmpty }) => {
    let sb = "";
    if (sign < 0) {
        sb += "-1 * ("
    }
    let first = true;
    for (let iDigit = digits.length - 1; iDigit >= 0; iDigit -= 1) {
        const value = digits[iDigit];
        const place = Math.pow(base, iDigit);
        if (skipEmpty && value == 0) {
            continue;
        }
        if (first) {
            first = false;
        } else {
            sb += " + ";
        }
        sb += `${value} * ${place}`;
    }
    if (sign < 0) {
        sb += ")"
    }
    return sb;
};

const sobBaseCreateAlphabet = (digits) => {
    let digitIntoValue = new Map;
    let valueIntoDigit = new Map;
    let value = 0;
    for (const digit of digits) {
        digitIntoValue.set(digit, value);
        valueIntoDigit.set(value, digit);
        value += 1;
    }
    return { digitIntoValue, valueIntoDigit };
};

const sobBaseDigitsParse = (text, { digitIntoValue }) => {
    let digits = [];
    let sign = 1;
    let buff = Array.from(text);
    let iBuff = 0;
    if (buff[iBuff] == "-" || buff[iBuff] == "+") {
        sign = buff[iBuff] == "-" ? -1 : 1;
        iBuff += 1;
    }
    for (undefined; iBuff < buff.length; iBuff += 1) {
        let value, digit;
        if (buff[iBuff] != "(") {
            digit = buff[iBuff];
            value = digitIntoValue.get(buff[iBuff]) ?? Number(digit);
        } else {
            digit = "";
            iBuff += 1;
            while (iBuff < buff.length) {
                if (buff[iBuff] == "(") {
                    throw Error(`unbalanced parens in number, expected a closing ')' at column ${iBuff}`);
                }
                if (buff[iBuff] == ")") {
                    break;
                }
                digit += buff[iBuff];
                iBuff += 1;
            }
            value = Number(digit);
        }
        if (isNaN(value) || !isFinite(value)) {
            throw Error(`invalid digit '${digit}', not part of the expected alphabet`);
        }
        digits.push(value);
    }
    digits.reverse();
    return { digits, sign };
};

const sobBaseDigitsStringify = ({ digits, sign }, { valueIntoDigit }) => {
    let sb = "";
    if (sign < 0) {
        sb += "-";
    }
    const valueSanitise = (value) => value >= 0 && value < 10 ? value.toString() : `(${value})`;
    if (digits.length == 0) {
        sb += "0";
    } else {
        for (let iDigit = digits.length - 1; iDigit >= 0; iDigit -= 1) {
            let value = digits[iDigit];
            sb += valueIntoDigit.get(value) ?? valueSanitise(value);
        }
    }
    return sb;
};