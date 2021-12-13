const fs = require('fs');

const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let count = 0;
for(var i = 0; i < entries.length-3; i++) {
    let val1 = parseInt(entries[i],10);
    let val2 = parseInt(entries[i+1],10);
    let val3 = parseInt(entries[i+2],10);
    let val4 = parseInt(entries[i+3],10);
    let window1 = val1+val2+val3;
    let window2 = val2+val3+val4;
    if(window2-window1 > 0) count++;
}
console.log(count);