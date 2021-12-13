const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
const crabpositions = input[0].split(",").map(x => parseInt(x,10));

let sample = "16,1,2,0,4,2,7,1,2,14";
sample = sample.split(",").map(x => parseInt(x,10));
let work = crabpositions;
work.sort((a, b) => a - b);

console.log(work.length);

//try the one in the middle and on each side
//let try1 = work[work.length/2];
let try1 = Math.floor(work.reduce((a, b) => a + b) / work.length);
let try2 = try1 + 1;


let totalfuel = work.map((v,i) => {
    const diff = Math.abs(try2 - v);
    return 0.5 * diff * (diff + 1);
});
console.log(totalfuel.reduce((p,c) => p + c));
