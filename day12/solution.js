const fs = require('fs');
const input = fs.readFileSync('sample1.txt', 'utf8').toString().trim().split("\r\n");
let caves = new Map();

for (var i = 0; i < input.length; i++) {
    const cavelabels = input[i].split("-");
    let cave0 = null;
    let cave1 = null;
    if(caves.has(cavelabels[0])) {
        cave0 = caves.get(cavelabels[0]);
    } else {
        cave0 = buildcave(cavelabels[0]);
        caves.set(cave0.label, cave0);
    }
    if(caves.has(cavelabels[1])) {
        cave1 = caves.get(cavelabels[1]);
    } else {
        cave1 = buildcave(cavelabels[1]);
        caves.set(cave1.label, cave1);
    }
    cave0.connections.push(cave1.label);
    cave1.connections.push(cave0.label);
}

console.log(caves);
let foundpaths = [];
const start = caves.get("start");
let visited = [];
generatepaths(start, []);
console.log(foundpaths);
console.log(foundpaths.length);

function generatepaths(node, path, lowerdoubled = false) {
    visited.push(node.label);
    path.push(node.label);
    if(node.label === "end"){
        //console.log(path);
        foundpaths.push(path.join(","));
    } else {
        for(var i = 0; i < node.connections.length; i++) {
            const key = node.connections[i];
            if(key === key.toUpperCase() || !visited.includes(key)) {
                generatepaths(caves.get(key), path, lowerdoubled);
            } else if (!lowerdoubled && !(key === "start" || key === "end")) {
                generatepaths(caves.get(key), path, true);
            }
            
        }
    }
    visited.pop();
    path.pop();
}


function buildcave(label) {
    return {
        "label":label,
        "connections":[]
    }
}