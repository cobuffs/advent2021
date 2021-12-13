const fs = require('fs');
const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
let mapping = new Map();

let sum = 0;
for(var i = 0; i < entries.length; i++) {
    let x1,x2,y1,y2;
    const points = entries[i].split(" -> ");
    const point1 = points[0].split(",");
    const point2 = points[1].split(",");
    x1 = parseInt(point1[0], 10);
    y1 = parseInt(point1[1], 10);
    x2 = parseInt(point2[0], 10);
    y2 = parseInt(point2[1], 10);
    const deltax = (x1 == x2) ? 0 : (x1 - x2) < 0 ? 1 : -1;
    const deltay = (y1 == y2) ? 0 : (y1 - y2) < 0 ? 1 : -1;
    let newx = x1;
    let newy = y1;
    while(newx !== x2 || newy !== y2) {
        const key = newx + "," + newy;
        if(mapping.has(key)){
            let point = mapping.get(key);
            point.countofvents++;
            if(point.countofvents === 2) sum++;
        } 
        else {
            mapping.set(key,{"countofvents": 1});
        }
        newx += deltax;
        newy += deltay;
    }
    const key = newx + "," + newy;
    if(mapping.has(key)){
        let point = mapping.get(key);
        point.countofvents++;
        if(point.countofvents === 2) sum++;
    } else {
        mapping.set(key,{"countofvents": 1});
    }
}
console.log(sum);
