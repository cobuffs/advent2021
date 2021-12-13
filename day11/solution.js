const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let totalflashes = 0;
let octopi = [];
for (var i = 0; i < input.length; i++) {
    octopi.push(input[i].split("").map(x => parseInt(x,10)));
}
stepitup();
//console.log(totalflashes);

function stepitup() {
    let loopit = true;
    let step = 1;
    while(loopit) {
        //seed the flashes
        let flashes = [];
        let processed = [];
        for(var row = 0; row < octopi.length; row++) {
            for(var col = 0; col < octopi[row].length; col++){
                octopi[row][col] += 1;
                if(octopi[row][col] > 9) {
                    flashes.push(row + "," + col);
                }
            }
        }
        while(flashes.length > 0) {
            const puskey = flashes.pop();
            processed.push(puskey);
            const xy = puskey.split(",").map(x=>parseInt(x,10));
            octopi[xy[0]][xy[1]] = 0;
            totalflashes++;
            updateadjacent(xy[0],xy[1],flashes,processed);
        }
        if(processed.length === 100) {
            loopit = false;
            console.log(step);
        }
        step++;
        //printgrid(octopi,step++); 
    }
}

function updateadjacent(row, col, flashes, processed) {
    const canup = row - 1 >= 0;
    const candown = row + 1 < octopi.length;
    const canleft = col - 1 >= 0;
    const canright = col + 1 < octopi[0].length;

    if(canup && canleft) {
        let flashkey = (row - 1) + "," + (col - 1);
        if(!processed.includes(flashkey)) {
            octopi[row - 1][col - 1] += 1;
            if (octopi[row - 1][col - 1] > 9 && !flashes.includes(flashkey)) flashes.push(flashkey);
        }
    }
    if(canup) {
        let flashkey = (row - 1) + "," + col;
        if(!processed.includes(flashkey)) octopi[row - 1][col] += 1;
        if (octopi[row - 1][col] > 9 && !processed.includes(flashkey) && !flashes.includes(flashkey)) flashes.push(flashkey);
    }
    if(canup && canright) {
        let flashkey = (row - 1) + "," + (col + 1);
        if(!processed.includes(flashkey)) octopi[row - 1][col + 1] += 1;
        if (octopi[row - 1][col + 1] > 9 && !processed.includes(flashkey) && !flashes.includes(flashkey)) flashes.push(flashkey);
    }
    if(canleft) {
        let flashkey = (row) + "," + (col - 1);
        if(!processed.includes(flashkey)) octopi[row][col - 1] += 1;
        if (octopi[row][col - 1] > 9 && !processed.includes(flashkey) && !flashes.includes(flashkey)) flashes.push(flashkey);
    }
    if(canright) {
        let flashkey = (row) + "," + (col + 1);
        if(!processed.includes(flashkey)) octopi[row][col + 1] += 1;
        if (octopi[row][col + 1] > 9 && !processed.includes(flashkey) && !flashes.includes(flashkey)) flashes.push(flashkey);
    }
    if(candown && canleft) {
        let flashkey = (row + 1) + "," + (col - 1);
        if(!processed.includes(flashkey)) octopi[row + 1][col - 1] += 1;
        if (octopi[row + 1][col - 1] > 9 && !processed.includes(flashkey) && !flashes.includes(flashkey)) flashes.push(flashkey);
    }
    if(candown) {
        let flashkey = (row + 1) + "," + (col);
        if(!processed.includes(flashkey)) octopi[row + 1][col] += 1;
        if (octopi[row + 1][col] > 9 && !processed.includes(flashkey) && !flashes.includes(flashkey)) flashes.push(flashkey);
    }
    if(candown && canright) {
        let flashkey = (row + 1) + "," + (col + 1);
        if(!processed.includes(flashkey)) octopi[row + 1][col + 1] += 1;
        if (octopi[row + 1][col + 1] > 9 && !processed.includes(flashkey) && !flashes.includes(flashkey)) flashes.push(flashkey);
    }
}

function printgrid(grid, step){
    let out = `After step ${step}\r\n`;
    for(var i = 0; i < grid.length; i++) {
        for(var j = 0; j < grid[i].length; j++) {
            out += grid[i][j];
        }
        out += "\r\n";
    }
    console.log(out)
}