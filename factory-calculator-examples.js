const examples = [];

examples.push(
    `
throughput 1/s

id : "a" =(1s)=> "a"
    `
);

examples.push(
    `
throughput 60/s

type bolt         = "-b-b-b-b-b-b"
type circuit      = "-c-c-c-c-c-c"
type construction = "-C-C-C-C-C-C"
type wire         = "-w-w-w-w-w-w"

stamp-bolt         : "R---------R-"           =(9s)=>  3x bolt
stamp-circuit      : "P-B-B-B-B-P-" + 3x bolt =(15s)=> circuit
stamp-construction : 2x bolt                  =(16s)=> 2x construction
stamp-wire         : "P-B-B-B-B-P-"           =(10s)=> 5x wire

stamp-circuit-ex   : 3x wire + 2x bolt + "R---------R-" + "P-B-B-B-B-P-" =(6s)=> 3x circuit

# possible with generics and tuples?
# pack : a + b + c + d + e + f + g + h =(8s)=> (a, b, c, d, e, f, g, h)
    `
);

for (const i in examples) {
    examples[i] = examples[i].trim();
}