const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let cavelocs = new Map();
let distances = new Map();
let visited = new Map();
let maxx = 0;
let maxy = 0;

for (var i = 0; i < input.length; i++) {
    const row = input[i].split("");
    for (var j = 0; j < row.length; j++) {
        const key = j + "," + i;
        cavelocs.set(key, {"key":key, "risk": parseInt(row[j], 10)});
        distances.set(key, {"key": key, "distance": 1000000});
        if(j > maxx) maxx = j;
    }
    if(i > maxy) maxy = i;
}

distances.set("0,0", {"key": "0,0", "distance": 0});

while(true) {
    let shortestdistance = 1000000;
    let shortestkey = null;
    cavelocs.forEach((v,k) => {
        if(distances.get(k).distance < shortestdistance && !visited.has(k)) {
            shortestdistance = distances.get(k);
            shortestkey = k;
        }
    });

    if(shortestkey === null) {
        console.log(distances);
        break;
    }

    //get neighbors
    const neighbors = getneighbors(shortestkey);
    for(var i = 0; i <  neighbors.length; i++) {
        const key = neighbors[i];
        if(cavelocs.get(key).risk !== 0 && distances.get(key).distance > (distances.get(shortestkey).distance + cavelocs.get(key).risk)) {
            const newdist = distances.get(shortestkey).distance + cavelocs.get(key).risk;
            distances.set(key, {"key": key, "distance": newdist});
        }
    }
    visited.set(shortestkey, true);
}


function getneighbors(key) {
    const points = key.split(",");
    const x = parseInt(points[0],10);
    const y = parseInt(points[1],10);
    let neighbors = [];

    //U
    if(y-1 >= 0) neighbors.push(x + "," + (y-1));
    //L
    if(x-1 >= 0) neighbors.push((x-1) + "," + y);
    //R
    if(x+1 <= maxx) neighbors.push((x+1) + "," + y);
    //D
    if(y+1 <= maxy) neighbors.push(x + "," + (y+1));
    return neighbors;
}