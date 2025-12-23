/*
throughput = 60/m (1/s)

Recipes
--------
3x -b-b-b-b-b-b = 1x R---------R-                   9s  Bolt Stamper
1x -c-c-c-c-c-c = 1x P-B-B-B-B-P- + 3x -b-b-b-b-b-b 15s Circuit Stamper
2x -C-C-C-C-C-C = 2x -b-b-b-b-b-b                   16s Construction 
*/

const gcd = (a, b) => !b ? a : gcd(b, a % b);

class SobRational {
    constructor (n = 0, m = 1) {
        this.n = n; // top value
        this.m = m; // bottom value
        this.simplify();
    }

    static TEMP_ = new SobRational;
    static makeTemp_(n = 0, m = 1) {
        this.TEMP_.n = n;
        this.TEMP_.m = m;
        return this.TEMP_;
    }

    addN(otherN, otherM = undefined) { this.add(SobRational.makeTemp_(otherN, otherM)) }
    add(other) {
        if (this.m == other.m) {
            this.n = this.n + other.n;
        } else {
            this.n = this.n * other.m + this.m * other.n;
            this.m = this.m * other.m;
        }
        this.simplify();
    }

    subN(otherN, otherM = undefined) { this.sub(SobRational.makeTemp_(otherN, otherM)) }
    sub(other) {
        if (this.m == other.m) {
            this.n = this.n - other.n;
        } else {
            this.n = this.n * other.m - this.m * other.n;
            this.m = this.m * other.m;
        }
        this.simplify();
    }

    multN(otherN, otherM = undefined) { this.mult(SobRational.makeTemp_(otherN, otherM)) }
    mult(other) {
        this.n = this.n * other.n;
        this.m = this.m * other.m;
        this.simplify();
    }

    divN(otherN, otherM = undefined) { this.div(SobRational.makeTemp_(otherN, otherM)) }
    div(other) {
        this.n = this.n * other.m;
        this.m = this.m * other.n;
        this.simplify();
    }

    simplify() {
        let r = gcd(this.n, this.m);
        if (r == 0) {
            return;
        }
        this.n /= r;
        this.m /= r;
        if (1 / this.m < 0) {
            this.m *= -1;
            this.n *= -1;
        }
    }

    toString() { return `${this.n} // ${this.m}` }
}

// throughputPerS * craftTimeS / quantity = machine ratio
class SobRecipe {
    constructor () {
        this.name = undefined;
        this.craftTime = 0;
        this.inputs = new Map;
        this.inputsQuantity = 0;
        this.outputs = new Map;
        this.outputsQuantity = 0;
    }

    addInput(resource, quantity = 1) {
        this.inputsQuantity += quantity;
        return this.inputs.set(resource, quantity);
    }

    addOuput(resource, quantity = 1) {
        this.outputsQuantity += quantity;
        return this.outputs.set(resource, quantity);
    }
}