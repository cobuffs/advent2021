const fs = require('fs');
//let contents = fs.readFileSync("adv01.txt", 'utf8').trim();
const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let entries2 = [];


for(var i = 0; i < entries.length; i++) {
    entries2.push(entries[i].split(""));
}

let result = entries2.reduce((r,a) => a.map((b,i) => (r[i] || 0) + parseInt(b,10)), []);

let gamma = "011000011101";
let ep =    "100111100010";

let gammaarr = gamma.split("");
let eparr = ep.split("");
let oxfound = false;
let co2found = false;
let oxcandidates = [];
let co2candidates = [];

for(var i = 0; i < entries.length; i++) {
    let entry = entries[i];
    if(entry.substr(0,1) === gamma.substr(0,1)) oxcandidates.push(entry.split(""));
    else co2candidates.push(entry.split(""));
}
let pos = 1;
while(!oxfound) {
    let updatedcounts = oxcandidates.reduce((r,a) => a.map((b,i) => (r[i] || 0) + parseInt(b,10)), []);
    let updatedcandidates = [];
    //if the counts >= length/2, keep 1s otherwise keep 0s;
    let bittokeep = updatedcounts[pos] >= oxcandidates.length/2 ? "1" : "0";
    updatedcandidates = oxcandidates.filter((val, i, arr) => val[pos] === bittokeep);
    oxcandidates = updatedcandidates;
    pos++;

    if(oxcandidates.length == 1) oxfound = true;
}

pos = 1;
while(!co2found) {
    let updatedcounts = co2candidates.reduce((r,a) => a.map((b,i) => (r[i] || 0) + parseInt(b,10)), []);
    let updatedcandidates = [];
    //if the counts >= length/2, keep 1s otherwise keep 0s;
    let bittokeep = updatedcounts[pos] < co2candidates.length/2 ? "1" : "0";
    updatedcandidates = co2candidates.filter((val, i, arr) => val[pos] === bittokeep);
    co2candidates = updatedcandidates;
    pos++;

    if(co2candidates.length == 1) co2found = true;
}
console.log(co2candidates);


const ox = parseInt("011111110111",2);
const co = parseInt("111001000001",2);
console.log(ox*co);

//console.log(oxcandidates);
