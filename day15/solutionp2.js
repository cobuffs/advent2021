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

//Dijkstra's algorithm only works on a weighted graph.

class WeightedGraph {
    constructor() {
        this.adjacencyList = {};
    }
    addVertex(vertex) {
        if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
    }
    addEdge(vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push({ node: vertex2, weight });
        //this.adjacencyList[vertex2].push({ node: vertex1, weight });
    }
    Dijkstra(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let path = []; //to return at end
        let smallest;
        //build up initial state
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }
        // as long as there is something to visit
        while (nodes.values.length) {
            smallest = nodes.dequeue().val;
            if (smallest === finish) {
                //WE ARE DONE
                //BUILD UP PATH TO RETURN AT END
                while (previous[smallest]) {
                    path.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (smallest || distances[smallest] !== Infinity) {
                for (let neighbor in this.adjacencyList[smallest]) {
                    //find neighboring node
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    //calculate new distance to neighboring node
                    let candidate = distances[smallest] + nextNode.weight;
                    let nextNeighbor = nextNode.node;
                    if (candidate < distances[nextNeighbor]) {
                        //updating new smallest distance to neighbor
                        distances[nextNeighbor] = candidate;
                        //updating previous - How we got to neighbor
                        previous[nextNeighbor] = smallest;
                        //enqueue in priority queue with new priority
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        return {"path": path.concat(smallest).reverse(),"distance":distances[finish]};
    }
}


const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let graph = new WeightedGraph();
let maxx = (input.length * 5) - 1;
let maxy = maxx;
const modifier = Math.ceil(maxx/5);
let cavelocs = new Map();

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
                graph.addVertex(key);
                //distances.set(key, {"key": key, "distance": 1000000});
            }
        }
    }
}

for(var i = modifier; i <= maxy; i++) {
    for(var j = 0; j <= maxx; j++) {
        //get the risk 10 above it and add 1
        let lookupkey = j + "," + (i-modifier);
        let mykey = j + "," + i;
        cavelocs.get(mykey).risk = (cavelocs.get(lookupkey).risk+1) % 10 === 0 ? 1 : (cavelocs.get(lookupkey).risk+1);
    }
}

//set up pq based djikstray
cavelocs.forEach((v,k) => {
    let neighbors = getneighbors(k);
    for(var i = 0; i < neighbors.length; i++) {
        //console.log(`Adding edge: ${k} -> ${neighbors[i]} with weight: ${cavelocs.get(neighbors[i]).risk}`);
        graph.addEdge(k, neighbors[i], cavelocs.get(neighbors[i]).risk);
    }
});

//printgrid();
let result = graph.Dijkstra("0,0", maxx + "," + maxy);
console.log(result.distance);
// let pathgrid = new Map();
// //sum up the risks
// for(var i = 0; i < shortestdist.length; i++) {
//     //sum += cavelocs.get(shortestdist[i]).risk;
//     pathgrid.set(shortestdist[i], cavelocs.get(shortestdist[i]).risk);
// }
// printgrid(pathgrid, maxx, maxy);

function printgrid(grid, maxx, maxy) {
    let output = "";
    for(var i = 0; i <= maxy; i++) {
        for(var j = 0; j <= maxx; j++) {
            if(grid.has(j + "," + i)) output += grid.get(j + "," + i);
            else output += " ";
        }
        output += "\r\n";
    }
    console.log(output);
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

