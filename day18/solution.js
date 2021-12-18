const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let snailnums = [];
let explodesam1 = [[[[[9,8],1],2],3],4];


for(var i = 0; i < input.length; i++) {
    snailnums.push(eval(input[i]));
}

//when parsing, keep left (can be a val or an array), right, previous, next)

while (explodesam1.length > 0) {
    let elem = explodesam1.shift();
    let depth = 1;
    console.log(`depth: ${depth} - ${elem}`);
    while(true && Array.isArray(elem)) {
        elem = elem.shift();
        depth++;
        console.log(`depth: ${depth} - ${elem}`);
        if(depth === 4) {
            //we should have a pair of 2 numbers? always? how do we get back up a layer?
        }
        if(!Array.isArray(elem)) break;
    }
}
function getdepthandarray(arr) {

}

function explode(numbers) {

}

function split(numbers) {
//    To split a regular number, replace it with a pair; the left element of the pair should be the regular number divided by two and rounded down, while the right element of the pair should be the regular number divided by two and rounded up. 
//    For example, 10 becomes [5,5], 11 becomes [5,6], 12 becomes [6,6], and so on.
}