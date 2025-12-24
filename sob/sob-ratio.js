const sobGcd = (a, b) => !b ? a : sobGcd(b, a % b);

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

    addN(otherN, otherM = undefined) { return this.add(SobRational.makeTemp_(otherN, otherM)) }
    add(other) {
        if (this.m == other.m) {
            this.n = this.n + other.n;
        } else {
            this.n = this.n * other.m + this.m * other.n;
            this.m = this.m * other.m;
        }
        this.simplify();
        return this;
    }

    subN(otherN, otherM = undefined) { return this.sub(SobRational.makeTemp_(otherN, otherM)) }
    sub(other) {
        if (this.m == other.m) {
            this.n = this.n - other.n;
        } else {
            this.n = this.n * other.m - this.m * other.n;
            this.m = this.m * other.m;
        }
        this.simplify();
        return this;
    }

    multN(otherN, otherM = undefined) { return this.mult(SobRational.makeTemp_(otherN, otherM)) }
    mult(other) {
        this.n = this.n * other.n;
        this.m = this.m * other.m;
        this.simplify();
        return this;
    }

    divN(otherN, otherM = undefined) { return this.div(SobRational.makeTemp_(otherN, otherM)) }
    div(other) {
        this.n = this.n * other.m;
        this.m = this.m * other.n;
        this.simplify();
        return this;
    }

    simplify() {
        let r = sobGcd(this.n, this.m);
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
    valueOf() { return this.n / this.m }
}

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

const sobMachineRatio = (throughput, craftTime, quantity) => {
    return new SobRational(throughput * craftTime, quantity);
};

const sobBuildRecipeGraph = (throughput, recipes) => {
    // builds a graph of all recipes and their resource outputs
};