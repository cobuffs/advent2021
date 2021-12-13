const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");
const dots = input.slice(0, input.indexOf(""));
const foldinst = input.slice(input.indexOf("") + 1);
let folds = [];

let maxx = 0;
let maxy = 0;

let grid = new Map();
//build the map
for(var i = 0; i < dots.length; i++) {
    const point = dots[i].split(",");
    const key = dots[i];
    const x = parseInt(point[0],10);
    const y = parseInt(point[1],10);
    grid.set(key, {"x":x,"y":y,"display": "#"});
    if(x > maxx) maxx = x;
    if(y > maxy) maxy = y;
}

//build the folds
for(var i = 0; i < foldinst.length; i++) {
    const temp = foldinst[i].split("=");
    const path = parseInt(temp[1], 10);
    const axis = temp[0].slice(temp[0].length - 1);
    folds.push([axis, path]);
}
//console.log(folds);
//printgrid();
//execute fold 1

for(var i = 0; i < folds.length; i++) {
    fold(folds[i][0], folds[i][1]);
}
printgrid();
getdots();

function printgrid(){
    let line = "";
    for(var row = 0; row <= maxy; row++){
        for(var col = 0; col <= maxx; col++){
            const key = col + "," + row;
            if(grid.has(key)) line += "#";
            else line += "."
        }
        line += "\r\n";
    }
    console.log(line);
}

function fold(axis, path) {
    let newgrid = new Map();
    if (axis === "x") {
        //fold left
        grid.forEach((v,k) => {
            if(v.x > path) {
                //get the mirrored point
                const newx = 2*path - v.x;
                newgrid.set(newx + "," + v.y, {"x":newx,"y":v.y,"display": "#"});
            } else {
                newgrid.set(k, v);
            }
        });
    } else {
        //fold up
        grid.forEach((v,k) => {
            if(v.y > path) {
                //get the mirrored point
                const newy = 2*path - v.y;
                newgrid.set(v.x + "," + newy, {"x":v.x,"y":newy,"display": "#"});
            } else {
                newgrid.set(k, v);
            }
        });
    }
    grid = newgrid;
    maxx = 0;
    maxy = 0;
    getnewmaxes();
}

function getnewmaxes() {
    grid.forEach((v,k) => {
        if(v.x > maxx) maxx = v.x;
        if(v.y > maxy) maxy = v.y;
    });
}

function getdots() {
    console.log(grid.size);
}