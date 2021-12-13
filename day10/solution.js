const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let corrupted = [];
let incomplete = [];
let valid = [];
let score = 0;
const open = ["(", "[", "{", "<"];
const close = [")", "]", "}", ">"];
const scores = [3, 57, 1197, 25137];
const autoscores = [1, 2, 3, 4];
let allthescores = [];

for (var i = 0; i < input.length; i++) {
    let line = input[i].split("");
    let result = processline(line);
    score += result.score;
    if(result.autocompletescore > 0) allthescores.push(result.autocompletescore);
//    console.log(result);
}

console.log(score);
allthescores.sort((a,b) => a-b);
console.log(allthescores[Math.floor(allthescores.length/2)]);

function processline(line) {
    let result = {"inst": line,"status": "unprocessed", "score":0, "autocompletescore": 0, "auto": []};
    let working = [];
    for(var i = 0; i < line.length; i++) {
        //if its opening something, add it to the queue
        const char = line[i];
        if(open.includes(char)) {
            working.push(char);
        } else if (close.includes(char)) {
            const lastopen = working.pop();
            if(open.indexOf(lastopen) !== close.indexOf(char)) {
                //corrupted
                result.status = "corrupted";
                result.score = scores[close.indexOf(char)];
                return result;
            }
        }
    }
    if(working.length > 0) {
        let autocomplete = [];
        while(working.length > 0) {
            const char = working.pop();
            const closingchar = close[open.indexOf(char)];
            autocomplete.push(closingchar);
            result.autocompletescore = (result.autocompletescore * 5) + autoscores[close.indexOf(closingchar)];
        }
        result.auto = autocomplete;
    }
    result.status = "done";
    return result;
}
