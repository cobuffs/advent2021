const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let heightmap = [];
let risklevels = [];
let basinpoints = [];
let pointmap = new Map();
let lowpoints = [];
let queue = [];

for (var i = 0; i < input.length; i++) {
    let row = input[i].split("").map(x => parseInt(x, 10));
    heightmap.push(row);
}

//hit every point and keep going until you hit a low point 
for (var row = 0; row < heightmap.length; row++) {
    for (var col = 0; col < heightmap[row].length; col++) {
        if (!pointmap.has(row + "," + col)) {
            //point we havent visited before 
            if (heightmap[row][col] !== 9) findlowpoint(row, col);
        } 
    }
}

console.log(risklevels.reduce((p, c) => p + c));
console.log(lowpoints);
processlowpoints();
basinpoints.sort((a,b) => b - a);
console.log(basinpoints[0]*basinpoints[1]*basinpoints[2]);


function processlowpoints(){
    for(var i = 0; i < lowpoints.length; i++) {
        let point = pointmap.get(lowpoints[i]);
        point.visited = true;
        basinpoints.push(1);
        buildbasin(point);
    }
}
function buildbasin(point) {
    //seed the queue
    queueupneighbors(point.row, point.col);
    while(queue.length > 0) {
        const working = queue.pop();
        const workingkey = working[0] + "," + working[1];
        
        let newpoint = pointmap.get(workingkey);
        if(newpoint.visited) continue;
        //increment the count
        basinpoints[basinpoints.length - 1] = basinpoints[basinpoints.length - 1] + 1;
        newpoint.visited = true;
        buildbasin(newpoint);
    }
}

function findlowpoint(row, col) {
    if (!pointmap.has(row + "," + col)) {
        let point = {
            "key": row + "," + col,
            "row": row,
            "col": col,
            "pathtolow": [],
            "islow": false,
            "visited": false
        };

        pointmap.set(point.key, point);
    }
    let point = pointmap.get(row + "," + col);
    if (point.islow) return point.basinid;
    let val = heightmap[row][col];
    let up = row - 1 >= 0 ? heightmap[row - 1][col] : 10;
    let down = row + 1 < heightmap.length ? heightmap[row + 1][col] : 10;
    let left = col - 1 >= 0 ? heightmap[row][col - 1] : 10;
    let right = col + 1 < heightmap[row].length ? heightmap[row][col + 1] : 10;
    //console.log(`up: ${up}, down: ${down}, left: ${left}, right: ${right}`); 
    if (val < up && val < down && val < left && val < right) {
        //its a low point 
        risklevels.push(val + 1);
        point.islow = true;
        lowpoints.push(point.key);
        return point.basinid;
    } else {
        //find the lowest neighbor and reprocess 
        let keys = [];
        const vals = [up, down, left, right];
        const min = vals.reduce((p, c) => Math.min(p, c));
        if (up === min) keys.push([row - 1, col]);
        if (down === min) keys.push([row + 1, col]);
        if (left === min) keys.push([row, col - 1]);
        if (right === min) keys.push([row, col + 1]);
        while (keys.length > 0) {
            const key = keys.pop();
            point.pathtolow.push(key);
            //check if its already been processed. if it has, add this point to that basin 
            if (!pointmap.has(key[0] + "," + key[1]))
                findlowpoint(key[0], key[1]);
        }
    }
}

function queueupneighbors(row, col) {
    let up = row - 1 >= 0 ? heightmap[row - 1][col] : 10; 
    let down = row + 1 < heightmap.length ? heightmap[row + 1][col] : 10;
    let left =  col - 1 >= 0 ? heightmap[row][col - 1] : 10; 
    let right = col + 1 < heightmap[row].length ? heightmap[row][col + 1] : 10;
    if (down < 9) queue.push([row + 1, col]);
    if (right < 9) queue.push([row, col + 1]);
    if (up < 9) queue.push([row - 1, col]);
    if (left < 9) queue.push([row, col - 1]);
}

