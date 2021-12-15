const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let cavelocs = new Map();
let distances = new Map();
let visited = new Map();
let maxx = (input.length * 5) - 1;
let maxy = maxx;
const modifier = Math.ceil(maxx/5);

//p2 dimsions are 5 times larger
for (var magy = 0; magy < 5; magy++) {
    for(var row = 0; row < input.length; row++) {
        let rowvals = input[row].split("");
        let newrow = (magy*modifier) + row;
        for(var magx = 0; magx < 5; magx++) {
            for (var col = 0; col < rowvals.length; col++) {
                let newcol = (magx*modifier) + col;
                let key = newcol + "," + newrow;
                const ogrisk = parseInt(rowvals[col], 10);
                let newrisk = ogrisk;
                if(magx > 0) {
                    //get a previous one
                    let newkey = (newcol - modifier) + "," + newrow;
                    newrisk = (cavelocs.get(newkey).risk+1) % 10 === 0 ? 1 : (cavelocs.get(newkey).risk+1);
                }
                cavelocs.set(key, {"key":key, "risk": newrisk});
                distances.set(key, {"key": key, "distance": 1000000});
            }
        }
    }
}

//update risks
for(var i = modifier; i <= maxy; i++) {
    for(var j = 0; j <= maxx; j++) {
        //get the risk 10 above it and add 1
        let lookupkey = j + "," + (i-modifier);
        let mykey = j + "," + i;
        cavelocs.get(mykey).risk = (cavelocs.get(lookupkey).risk+1) % 10 === 0 ? 1 : (cavelocs.get(lookupkey).risk+1);
    }
}

distances.set("0,0", {"key": "0,0", "distance": 0});




// old and busted. try the priority queue implementation
// while(true) {
//     //break;
//     let shortestdistance = 1000000;
//     let shortestkey = null;
//     cavelocs.forEach((v,k) => {
//         if(distances.get(k).distance < shortestdistance && !visited.has(k)) {
//             shortestdistance = distances.get(k);
//             shortestkey = k;
//         }
//     });

//     if(shortestkey === null) {
//         //console.log(distances);
//         break;
//     }

//     //get neighbors
//     const neighbors = getneighbors(shortestkey);
//     for(var i = 0; i <  neighbors.length; i++) {
//         const key = neighbors[i];
//         if(cavelocs.get(key).risk !== 0 && distances.get(key).distance > (distances.get(shortestkey).distance + cavelocs.get(key).risk)) {
//             const newdist = distances.get(shortestkey).distance + cavelocs.get(key).risk;
//             distances.set(key, {"key": key, "distance": newdist});
//         }
//     }
//     visited.set(shortestkey, true);
// }

console.log(distances.get(maxx + "," + maxy));
console.log(visited.size);

let pq = new PriorityQueue(5);

function djikstraqueue() {
    let dists = {};
    let prev = {};
    let pq = new PriorityQueue(this.nodes.length * this.nodes.length);
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

function printgrid() {
    let output = "";
    for(var i = 0; i <= maxy; i++) {
        for(var j = 0; j <= maxx; j++) {
            output += cavelocs.get(j + "," + i).risk;
        }
        output += "\r\n";
    }
    console.log(output);
}

class Node {
    constructor(val, priority) {
      this.val = val;
      this.priority = priority;
    }
  }
  
  class PriorityQueue {
    constructor() {
      this.values = [];
    }
    enqueue(val, priority) {
      let newNode = new Node(val, priority);
      this.values.push(newNode);
      this.bubbleUp();
    }
    bubbleUp() {
      let idx = this.values.length - 1;
      const element = this.values[idx];
      while (idx > 0) {
        let parentIdx = Math.floor((idx - 1) / 2);
        let parent = this.values[parentIdx];
        if (element.priority >= parent.priority) break;
        this.values[parentIdx] = element;
        this.values[idx] = parent;
        idx = parentIdx;
      }
    }
    dequeue() {
      const min = this.values[0];
      const end = this.values.pop();
      if (this.values.length > 0) {
        this.values[0] = end;
        this.sinkDown();
      }
      return min;
    }
    sinkDown() {
      let idx = 0;
      const length = this.values.length;
      const element = this.values[0];
      while (true) {
        let leftChildIdx = 2 * idx + 1;
        let rightChildIdx = 2 * idx + 2;
        let leftChild, rightChild;
        let swap = null;
  
        if (leftChildIdx < length) {
          leftChild = this.values[leftChildIdx];
          if (leftChild.priority < element.priority) {
            swap = leftChildIdx;
          }
        }
        if (rightChildIdx < length) {
          rightChild = this.values[rightChildIdx];
          if (
            (swap === null && rightChild.priority < element.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority)
          ) {
            swap = rightChildIdx;
          }
        }
        if (swap === null) break;
        this.values[idx] = this.values[swap];
        this.values[swap] = element;
        idx = swap;
      }
    }
  }
  