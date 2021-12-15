const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let instructions = new Map();
const template = input[0];
let counts = new Map();

for(var i = 2; i < input.length; i++) {
    let temp = input[i].split(" -> ");
    let key = temp[0];
    let mapping = temp[1];
    instructions.set(key, {"key":key, "mapping":mapping, "expanded":[key.substr(0,1) + mapping, mapping + key.substr(1,1)]});
}

let polymer = {
    "first":template.substr(0,1),
    "last":template.substr(template.length-1,1),
    "counts": new Map()
};
polymer.counts.set(polymer.first, 1);

//seed the template into combos
let combos = new Map();
for(var i = 0; i < template.length - 1; i++) {
    let newpoly = template.substr(i,2);
    if(combos.has(newpoly)) {
        combos.get(newpoly).occurs = BigInt(combos.get(newpoly).occurs + 1n);
    } else {
        combos.set(newpoly, {"occurs":BigInt(1)});
    }
}

for(var step = 0; step < 1000000; step++) {
    //reset our polymer counts
    polymer.counts = new Map();
    polymer.counts.set(polymer.first, 1);
    let newcombos = new Map();
    combos.forEach((v,k) => {
        const inst = instructions.get(k);
        for(var i = 0; i < inst.expanded.length; i++) {
            let foo = null;
            const key = inst.expanded[i];
            if(newcombos.has(key)) {
                foo = newcombos.get(key);
                foo.occurs +=  BigInt(v.occurs);
            }
            else {
                //first time we've seen this mapping
                foo = {"occurs":  BigInt(v.occurs)};
                newcombos.set(key, foo);
            }
        }
    });
    combos = new Map(newcombos);
    if(step % 10000 === 0) console.log(step);
}
updatesums();
getdiff();

function updatesums() {
    let sums = new Map();
    sums.set(polymer.first, 1);
    combos.forEach((v,k) => {
        let key = k.substr(1,1);
        if(sums.has(key)) sums.set(key, BigInt(sums.get(key)) + BigInt(v.occurs));
        else sums.set(key, BigInt(v.occurs));
    });
    polymer.counts = sums;
}

function getdiff(){
    let min = BigInt(polymer.counts.get("C"));
    let max = BigInt(0);
    polymer.counts.forEach(v => {
        if(v < min) min = BigInt(v);
        if(v > max) max = BigInt(v);
    });
    //console.log(`Diff: ${max - min}`);
    let diff = BigInt(max) - BigInt(min);
    fs.writeFileSync('millionout.txt', diff.toString());
}

function bruteforce(polystr) {
    let output = polystr.substr(0,1);
    for(var i = 0; i < polystr.length - 1; i++) {
        //get the pair
        let key = polystr.substr(i,2);
        output = output + instructions.get(key).mapping + key.substr(1,1);
    }
    console.log(output);
}