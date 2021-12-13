const fs = require('fs');
//let contents = fs.readFileSync("adv01.txt", 'utf8').trim();
const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let horpos = 0;
let depth = 0;
let aim = 0;

for(var i = 0; i < entries.length; i++) {
    let inst = entries[i].split(" ");
    if(inst[0] === "forward") {
        horpos += parseInt(inst[1], 10);
        depth += (aim * parseInt(inst[1], 10));
    }
    if(inst[0] === "up") {
        aim -= parseInt(inst[1], 10);
    }
    if(inst[0] === "down") {
        aim += parseInt(inst[1], 10);
    }
}

console.log(horpos * depth);