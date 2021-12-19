const fs = require('fs');
const input = fs.readFileSync('sample.txt', 'utf8').toString().trim().split("\r\n");
let scanners = new Map();
let activescanner = null;
let beaconcounter = 0;
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
        activescanner.beacons.push({"beaconid": activescanner.id + " - " + beaconcounter++, "beaconloc": beacon, "distances": []});
    }
}

scanners.forEach(v => {
    builddistanes(v);
});
//now we need to look for overlap between scanners. we'll start with 0
activescanner = scanners.get("0");
let overlapping = [];
scanners.forEach(v => {
    if(v.id !== activescanner.id){
        //look for all 3 abs distances in any order in 0 distances
        for(var i = 0; i < v.beacons.length; i++) {
            for(var j = 0; j < v.beacons[i].distances.length; j++) {
                const dist1 = v.beacons[i].distances[j].absdistance[0];
                const dist2 = v.beacons[i].distances[j].absdistance[1];
                const dist3 = v.beacons[i].distances[j].absdistance[2];
                //look for them in 0
                //if they are all 0s, just ignore it
                if(dist1 !== 0 && dist2 !== 0 & dist3 !== 0) {
                    for(var m = 0; m < activescanner.beacons.length; m++) {
                        const beacon2 = activescanner.beacons[m];
                        for(var n = 0; n < beacon2.distances.length; n++){
                            const updistances = beacon2.distances[n].absdistance;
                            //console.log(updistances);
                            if(updistances.includes(dist1) && updistances.includes(dist2) && updistances.includes(dist3)) {
                                console.log(`Found one!!!!`);
                                //beacon2.distances[n] is distance from beacon2.id to beacon2.distances[n].tobeacon
                                let beaconkey = [beacon2.beaconid, beacon2.distances[n].tobeacon];
                                //is the same as 
                                let originationbea = [v.beacons[i].beaconid, v.beacons[i].distances[j].tobeacon];
                                beaconkey.sort();
                                originationbea.sort();
                                overlapping.push([beaconkey,originationbea]);
                            }
                        }
                    }
                }
            }
        }
    }
}); 

console.log("done");



function builddistanes(scanner) {
    for(var i = 0; i < scanner.beacons.length; i++) {
        let mainbeacon = scanner.beacons[i];
        for(var j = 0; j < scanner.beacons.length; j++) {
            const secondbeacon = scanner.beacons[j];
            let distance = {"tobeacon": secondbeacon.beaconid, "distance":[]};
            distance.distance = [mainbeacon.beaconloc[0] - secondbeacon.beaconloc[0], mainbeacon.beaconloc[1] - secondbeacon.beaconloc[1], mainbeacon.beaconloc[2] - secondbeacon.beaconloc[2]];
            //can i get away with absolute values?
            distance["absdistance"] = distance.distance.map(v => Math.abs(v));
            mainbeacon.distances.push(distance);
        }
    }
}