const fs = require('fs');
let input = fs.readFileSync('sample.txt', 'utf8').toString().trim().split("\r\n");
let sample1 = '[[[[[9,8],1],2],3],4]';
let sample2 = '[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]';
let sample3 = '[7,[6,[5,[4,[3,2]]]]]';
let sample4 = '[[[[[4,3],4],4],[7,[[8,4],9]]],[1,1]]';
let working = sample4.split("");

let main = input.shift();
while(input.length > 0){
    const newone = input.shift();
    main = add(main, newone);
    main = reduce(main);
}
console.log(main);
function reduce(snailnum) {
    let working = snailnum.split("");
    let action = true;
    while(action) {
        let keeptrying = true;
        while (keeptrying) {
            const result = trytoexplode(working);
            keeptrying = result.exploded;
            working = result.updated;
        }
        //check for split. if none, we're done!
        let splitindex = -1;
        for(var i = 0; i < working.length; i++){
            if(parseInt(working[i],10) > 9) {
                splitindex = i;
                break;
            }
        }
        if(splitindex > -1) working = split(working, splitindex);
        else action = false;
    }
    return working.join("");
}

function add(num1, num2) {
    let newnum = "[" + num1 + "," + num2 + "]";
    return newnum;
}

function split(working, index) {
    //need everything before the index and everything after it
    let firsthalf = working.slice(0, index);
    let secondhalf = working.slice(index + 1);
    let num = working[index];
    let middle = ["[",Math.floor(num/2),",",Math.ceil(num/2),"]"]
    let newarr = firsthalf.concat(middle).concat(secondhalf);
    return newarr
}

function getmag(working) {
    //The magnitude of a pair is 3 times the magnitude of its left element plus 2 times the magnitude of its right element.
    
}

function trytoexplode(working) {
    let depth = 0;
    let previous = -1;
    let updated = [];
    let exploded = false;
    let needtosplit = false;
    let splitindexes = [];

    for(var i = 0; i < working.length; i++){
        let char = working[i];
        if(char === "[") {
            depth++;
            updated.push(char);
        } else if (char === ",") {
            updated.push(char);
        } else if (char === "]") {
            depth--;
            updated.push(char);
        } else {
            //num
            if (depth > 4 && !exploded) {
                //need to explode
                //find the next one
                //ignore the next ] and ,
                exploded = true;
                updated.pop();
                let left = parseInt(char,10);
                updated.push(0);
                i = i + 2;
                let right = parseInt(working[i],10);
                depth--;
                i = i + 2;
                if(previous !== -1) {
                    updated[previous] += left;
                    if(updated[previous] > 9) {
                        needtosplit = true;
                        splitindexes.push(previous)
                    }
                    
                }
                let done = false;
                while (!done && i < working.length) {
                    //go until we find a number
                    char = working[i];
                    if(char === "[" || char === "]" || char === ",") updated.push(char);
                    else {
                        char = parseInt(char, 10) + right;
                        updated.push(char);
                        if(char > 9) {
                            needtosplit = true;
                            splitindexes.push(updated.length - 1);
                        }
                        //should be ] or a , check the previous character to figure it out
                        if(updated[updated.length - 2] === "[") updated.push(',');
                        else updated.push(']');
                        done = true;
                    }
                    i++
                }
            } else {
                updated.push(parseInt(char,10));
                previous = updated.length - 1;
            }
        }
    }
    console.log(updated.join(""));

    return {"updated": updated, "exploded": exploded, "needtosplit": needtosplit, "splitindex": splitindexes};
}
