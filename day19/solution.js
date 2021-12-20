const fs = require('fs');
const { get } = require('http');
const input = fs.readFileSync('sample.txt', 'utf8').toString().trim().split("\r\n");
let scanners = new Map();
let activescanner = null;
let beaconcounter = 0;
let beadists = new Map();
for(var i = 0; i < input.length; i++) {
    const row = input[i];
    if(row.substring(0,2) === "--") {
        // we have a scanner
        let scanner = {};
        scanner["id"] = row.split(" ")[2];
        scanner["beacons"] = [];
        activescanner = scanner;
        beaconcounter = 0;
        scanners.set(scanner.id, scanner);
    } else if (row !== "") {
        //we have a beacon
        let beacon = row.split(",");
        beacon = beacon.map(v=> parseInt(v,10));
        activescanner.beacons.push({"beaconid":beaconcounter++, "beaconloc": beacon, "distancestoothers":[], "possiblepoints": generatepoints(beacon)});
    }
}
//scanners.forEach(v => builddistances(v));
//build distances for scanner 0;
activescanner = scanners.get("0");
buildonedistance(activescanner);
activescanner.scanners.get("1");
buildonedistance(activescanner);

//look for overlap in scanner 1
lookforoverlap(scanners.get("0"), scanners.get("1"));

console.log("done");

function arreq(arr1, arr2) {
    return (arr1[0] === arr2[0] && arr1[1] === arr2[1] && arr1[2] === arr2[2]);
}

function lookforoverlap(s1, s2) {
    //build a list of shared distances
    let shareddistances = [];
    for(var i = 0; i < s1.beacons.length; i++) {
        
    }
}

function buildonedistance(activescanner) {
    for(var i = 0; i < activescanner.beacons.length; i++) {
        const point1 = activescanner.beacons[i].beaconloc;
        let distances = activescanner.beacons[i].distancestoothers;
        for(var j = 0; j < activescanner.beacons.length; j++) {
            const point2 = activescanner.beacons[j].beaconloc;
            distances.push([point1[0]-point2[0], point1[1]-point2[1], point1[2]-point2[2]]);
        }
    }
}

// scanners.forEach(v => {
//     builddistances(v);
// });
//now we need to look for overlap between scanners. we'll start with 0
// activescanner = scanners.get("0");
// let overlapping = new Map();
// scanners.forEach(v => {
//     if(v.id !== activescanner.id){
//         //look for all 3 abs distances in any order in 0 distances
//         for(var i = 0; i < v.beacons.length; i++) {
//             for(var j = 0; j < v.beacons[i].distances.length; j++) {
//                 const dist1 = v.beacons[i].distances[j].absdistance[0];
//                 const dist2 = v.beacons[i].distances[j].absdistance[1];
//                 const dist3 = v.beacons[i].distances[j].absdistance[2];
//                 //look for them in 0
//                 //if they are all 0s, just ignore it
//                 if(dist1 !== 0 && dist2 !== 0 & dist3 !== 0) {
//                     for(var m = 0; m < activescanner.beacons.length; m++) {
//                         const beacon2 = activescanner.beacons[m];
//                         for(var n = 0; n < beacon2.distances.length; n++){
//                             const updistances = beacon2.distances[n].absdistance;
//                             //console.log(updistances);
//                             if(updistances.includes(dist1) && updistances.includes(dist2) && updistances.includes(dist3)) {
//                                 console.log(`Found one!!!!`);
//                                 //beacon2.distances[n] is distance from beacon2.id to beacon2.distances[n].tobeacon
//                                 let beaconkey = [beacon2.beaconid, beacon2.distances[n].tobeacon];
//                                 //is the same as 
//                                 let originationbea = [v.beacons[i].beaconid, v.beacons[i].distances[j].tobeacon];
//                                 beaconkey.sort();
//                                 originationbea.sort();
//                                 overlapping.set(beaconkey + " to " + originationbea, true);
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }); 

function rotate3d(point, degrees) {
    var sinTheta = Math.sin(degrees);
    var cosTheta = Math.cos(degrees);
    let x = point[0];
    let y = point[1];
    let z = point[2];
    point[1] = Math.round(y * cosTheta - z * sinTheta);
    point[2] = Math.round(z * cosTheta + y * sinTheta);
    return point;
}


function builddistances(scanner) {
    //there are 48 possible point
    let distances = [];
    for(var i = 0; i < scanner.beacons.length; i++){
        let beacon1 = scanner.beacons[i];
        let distancestootherbeacons = [];
        for(var j = 0; j < scanner.beacons.length; j++) {
            let beacon2 = scanner.beacons[j];
            for(var k = 0; k < beacon1.possiblepoints.length; k++) {
                const point1 = beacon1.possiblepoints[k];
                const point2 = beacon2.possiblepoints[k];
                let key = [point1[0]-point2[0], point1[1]-point2[1], point1[2]-point2[2]];
                key.sort((a,b) => a-b);
                key = key.toString();
                const tostore = {"scanner":scanner.id, "from":beacon1.beaconid, "to":beacon2.beaconid, "dist": key, "orientation": k};
                //distances.push(`diff between beacon ${beacon1.beaconid} and ${beacon2.beaconid}: ${[point1[0]-point2[0], point1[1]-point2[1], point1[2]-point2[2]]} - orientation: ${k}`);
                if(beadists.has(key.toString())) {
                    beadists.get(key.toString()).push(tostore);
                    if(beadists.get(key.toString()).length > 11 && key !== "0,0,0") console.log(key);
                }
                else beadists.set(key.toString(),[tostore]);
            }
        }
    }
    //fs.writeFileSync("output.txt", distances.join("\r\n"));
}

    // for(var i = 0; i < scanner.beacons.length; i++) {
    //     let mainbeacon = scanner.beacons[i];
    //     for(var k = 0; k < mainbeacon.possiblepoints.length; k++) {
    //         let distancestootherbeacons = [];
    //         let rep1 = mainbeacon.possiblepoints[k];
    //         for(var j = 0; j < scanner.beacons.length; j++) {
    //             const secondbeacon = scanner.beacons[j];
    //             let rep2 = secondbeacon.possiblepoints[k];
    //             let distance = {"scanner": scanner.id, "frombeacon": mainbeacon.beaconid, "tobeacon": secondbeacon.beaconid, "orientation": k, "distance":[]};
    //             distance.distance = [rep1[0]-rep2[0], rep1[1]-rep2[1], rep1[2]-rep2[2]];
    //             distancestootherbeacons.push(distance);
    //             //console.log(distancestootherbeacons);
    //         }
    //     }
    // }
function generatepoints(point) {
    let points = [];
    let ox = point[0];
    let oy = point[1];
    let oz = point[2];
    //generate 24 points x,y,z
    for(var i = 0; i < 1; i++){
        points.push([ox,oy,oz]);
        points.push(rotate3d([ox,oy,oz], Math.PI/2));
        points.push(rotate3d([ox,oy,oz], Math.PI));
        points.push(rotate3d([ox,oy,oz], 1.5*Math.PI));

        //x,z,y
        //point = [ox,oz,oy];
        points.push([ox,oz,oy]);
        points.push(rotate3d([ox,oz,oy], Math.PI/2));
        points.push(rotate3d([ox,oz,oy], Math.PI));
        points.push(rotate3d([ox,oz,oy], 1.5*Math.PI));

        //y,x,z
        //point = [oy,ox,oz];
        points.push([oy,ox,oz]);
        points.push(rotate3d([oy,ox,oz], Math.PI/2));
        points.push(rotate3d([oy,ox,oz], Math.PI));
        points.push(rotate3d([oy,ox,oz], 1.5*Math.PI));

        //y,z,x
        //point = [oy,oz,ox];
        points.push([oy,oz,ox]);
        points.push(rotate3d([oy,oz,ox], Math.PI/2));
        points.push(rotate3d([oy,oz,ox], Math.PI));
        points.push(rotate3d([oy,oz,ox], 1.5*Math.PI));

        //z,x,y
        //point = [oz,ox,oy];
        points.push([oz,ox,oy]);
        points.push(rotate3d([oz,ox,oy], Math.PI/2));
        points.push(rotate3d([oz,ox,oy], Math.PI));
        points.push(rotate3d([oz,ox,oy], 1.5*Math.PI));

        //z,y,x
        //point = [oz,oy,ox];
        points.push([oz,oy,ox]);
        points.push(rotate3d([oz,oy,ox], Math.PI/2));
        points.push(rotate3d([oz,oy,ox], Math.PI));
        points.push(rotate3d([oz,oy,ox], 1.5*Math.PI));

        ox *= -1;
        oy *= -1;
        oz *= -1;
    }
    return points;
}