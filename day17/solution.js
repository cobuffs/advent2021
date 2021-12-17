//input: target area: x=139..187, y=-148..-89
//main input
const xmin = 139;
const xmax = 187;
const ymin = -148;
const ymax = -89;

// //sample
// const xmin = 20;
// const xmax = 30;
// const ymin = -10;
// const ymax = -5;

//the steepest should probably hit as close to xmin as possible?
//since x decreases by 1 and y decreases by 1 (falls faster due to gravity)

//for a given number x, x+(x-1)+(x-2)+...+(x-n) is between xmin and xmax

//find xvalues
let possiblexs = new Map();
let stepoptionsforx = new Map();
let stoppedxs = [];
for(var i = 1; i <= xmax; i++) {
    let x = i;
    let step = 1;
    let distancetraveled = 0;
    while (x > 0) {
        distancetraveled += x--
        if (distancetraveled >= xmin && distancetraveled <= xmax) {
            let xelem = null;
            if (possiblexs.has(i)) xelem = possiblexs.get(i);
            else xelem = {"x": i, "stopped": false, "steps": []};
            xelem.steps.push(step);
            possiblexs.set(i, xelem);
            let stepop = null;
            if (stepoptionsforx.has(step)) stepop = stepoptionsforx.get(step);
            else stepop = {"step": step, "xs": []}
            stepop.xs.push(i);
            stepoptionsforx.set(step, stepop);
            //console.log(`Hit after ${step} steps with x of ${i} and ${distancetraveled} xpos`);
        }
        else if (distancetraveled > xmax) break;
        step++;
    }
    if(distancetraveled >= xmin && distancetraveled <= xmax) {
        possiblexs.get(i).stopped = true;
        stoppedxs.push({"stoppedafterstep": step, "x": i});
        //these can support any valid y;
    }
}

console.log(stoppedxs);

//try a bunch of positive ys and see what happens
let possibleys = new Map();
let stepoptionsfory = new Map();
for(var i = ymin; i < Math.abs(ymin); i++) {
    let yvel = i;
    let step = 1;
    let currentpos = yvel;
    let maxheight = 0;
    while (currentpos >= ymin) {
        if (currentpos > maxheight) maxheight = currentpos;
        //update y
        if(currentpos >= ymin && currentpos <= ymax) {
            //hit
            let elemy = null;
            if(possibleys.has(i)) elemy = possibleys.get(i);
            else elemy = {"y": i, "steps":[], "maxheight":maxheight};
            elemy.steps.push(step);
            possibleys.set(i, elemy);

            let stepop = null;
            if (stepoptionsfory.has(step)) stepop = stepoptionsfory.get(step);
            else stepop = {"step": step, "ys": []}
            stepop.ys.push(i);
            stepoptionsfory.set(step, stepop);

        }
        step++;
        yvel--;
        currentpos += yvel;
    }
}
// console.log(stepoptionsforx);
// console.log(stepoptionsfory);
//multiple everything together and see what we get
let possibleshots = new Map();
stepoptionsfory.forEach(v => {
    //look up the x, do some multiplication
    for(var i = 0; i < v.ys.length; i++) {
        if(stepoptionsforx.has(v.step)) {
            const xstep = stepoptionsforx.get(v.step);
            for(var j = 0; j < xstep.xs.length; j++) {
                let key = xstep.xs[j] + "," + v.ys[i];
                possibleshots.set(key, true);
            }
        }
        for(var j = 0; j < stoppedxs.length; j++) {
            const stoppedx = stoppedxs[j];
            if(v.step >= stoppedx.stoppedafterstep) {
                let key = stoppedx.x + "," + v.ys[i];
                possibleshots.set(key, true);
            }
        }
    }
});
console.log(possibleshots.size)
//for each x and steps, try some ys
// let possibleshots = new Map();
// possiblexs.forEach(v => {
//     //find where y is after the number of steps
//     for(var i = 0; i < v.steps; i++) {
//         //see where y is after that many steps. if its in bounds, we have a possible shot
//         for(var j = 1; j < 150; j++) {
//             let y = j;
//             //see where y is after the step
//         }
//     }
//});