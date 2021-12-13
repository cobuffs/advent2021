const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let journalentries = [];
let outputs = [];
let sum = 0;

//model numbers as arrays of len 7. pos 0 is the top, clockwise through pos 5, pos 6 is the middle

for(var i = 0; i < input.length; i++) {
    const entry = buildentry(input[i])
    journalentries.push(entry);
    const countofoutputdigits = entry.output.map(v => v.length);
    solveit(entry);
    

}
console.log(outputs.reduce((p,v) => p+v));

function buildentry(unstructured) {
    let entry = {"patterns": [], "output":[]};
    const temp = unstructured.split(" | ");
    entry.patterns = temp[0].split(" ");
    entry.output = temp[1].split(" ");
    
    return entry;
}

function getcount(arr, value) {
    return arr.filter((v) => (v === value)).length;
}

function solveit(entry) {
    //start with our unique ones
    //difference between 1 and 7 guarantees the p0
    //if 8 removing a segment keeps 1s segments, we've found p6
    //if 8 removing a segment keeps only 1 of 1s segments, we've found p1 and p2 
    //    which can then get me p5 by looking at len 4s
    //    which then gets me p3 by looking at len 6s containing all segments
    //    which then gets me p4 because i know 8


    //len 6: 0, 6, 9
    //
    let key = [false, false, false, false, false, false, false];
    let zero = "";
    let one = "";
    let two = "";
    let three = "";
    let four = "";
    let five = "";
    let six = "";
    let seven = "";
    let eight = "";
    let nine = "";
    let unprocessed = [];

    for(var i = 0; i < entry.patterns.length; i++){
        const digit = entry.patterns[i];
        if(digit.length === 2) {
            one = digit.split(""); 
        } else if (digit.length === 3) {
            seven = digit.split("");
        } else if (digit.length === 4) {
            four = digit.split("");
        } else if (digit.length === 7) {
            eight = digit.split("");
        } else {
            //save for processing later
            unprocessed.push(digit);
        }
    }
    key[0] = seven.filter(x => !one.includes(x)).join();
    
    //i need the strings with len to work with for the 8. these are 0, 9, 6
    let sixes = unprocessed.filter(v => v.length === 6);
    //find the 6 and process it
    for(var i = 0; i < sixes.length; i++) {
        const work = sixes[i].split("");
        //find segment missing from 8
        const missingseg = eight.filter(x => !work.includes(x)).join();
        if(one.includes(missingseg)) {
            //we're done. we've found the 6
            six = work;
            key[1] = missingseg;
            key[2] = one.filter(x => x !== missingseg).join();
            sixes = sixes.filter(str => str !== work.join(""));
            break;
        }
    }
    //find the 9 and process it
    for(var i = 0; i < sixes.length; i++) {
        const work = sixes[i].split("");
        //find segment missing from 8
        const missingseg = eight.filter(x => !work.includes(x)).join();
        if(!four.includes(missingseg)) {
            //we're done. we've found the 9
            nine = work;
            key[4] = missingseg;
            
            sixes = sixes.filter(str => str !== work.join(""));
            break;
        }
    }

    //find the 0 and process it
    for(var i = 0; i < sixes.length; i++) {
        const work = sixes[i].split("");
        //find segment missing from 8
        const missingseg = eight.filter(x => !work.includes(x)).join();
        if(four.includes(missingseg)) {
            //we're done. we've found the 0
            zero = work;
            key[6] = missingseg;
            
            sixes = sixes.filter(str => str !== work.join(""));
            break;
        }
    }
    //we can take what we know to find p5 by looking at the which segment is included in 4 but not in our known segments
    key[5] = four.filter(x => !key.includes(x)).join();

    //now we can figure out p3 by looking at eight
    key[3] = eight.filter(x => !key.includes(x)).join();

    //console.log(`we should have 0,1,2,4,6: ${key[0]},${key[1]},${key[2]},${key[4]},${key[6]},${key[5]},${key[3]}`);

    //now we can figure out our output
    outputs.push(parseInt(gimmeanum(key, entry.output),10));
}

function gimmeanum(key, arr) {
    let strnum = "";
    for(var i = 0; i < arr.length; i++) {
        let item = arr[i];
        if(item.length === 2) strnum += "1";
        else if(item.length === 3) strnum += "7";
        else if(item.length === 4) strnum += "4";
        else if(item.length === 7) strnum += "8";
        else if(item.length === 6) {
            //0,6,9
            if(!item.includes(key[6])) strnum += "0";
            else if(!item.includes(key[1])) strnum += "6";
            else strnum += "9";
        } else {
            if(!item.includes(key[2])) strnum += "2";
            else if(!item.includes(key[1])) strnum += "5";
            else strnum += "3";
        }
    }
    return strnum;
}