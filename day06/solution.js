const input = "1,1,1,1,1,1,1,4,1,2,1,1,4,1,1,1,5,1,1,1,1,1,1,1,1,1,1,1,1,5,1,1,1,1,3,1,1,2,1,2,1,3,3,4,1,4,1,1,3,1,1,5,1,1,1,1,4,1,1,5,1,1,1,4,1,5,1,1,1,3,1,1,5,3,1,1,1,1,1,4,1,1,1,1,1,2,4,1,1,1,1,4,1,2,2,1,1,1,3,1,2,5,1,4,1,1,1,3,1,1,4,1,1,1,1,1,1,1,4,1,1,4,1,1,1,1,1,1,1,2,1,1,5,1,1,1,4,1,1,5,1,1,5,3,3,5,3,1,1,1,4,1,1,1,1,1,1,5,3,1,2,1,1,1,4,1,3,1,5,1,1,2,1,1,1,1,1,5,1,1,1,1,1,2,1,1,1,1,4,3,2,1,2,4,1,3,1,5,1,2,1,4,1,1,1,1,1,3,1,4,1,1,1,1,3,1,3,3,1,4,3,4,1,1,1,1,5,1,3,3,2,5,3,1,1,3,1,3,1,1,1,1,4,1,1,1,1,3,1,5,1,1,1,4,4,1,1,5,5,2,4,5,1,1,1,1,5,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,5,1,1,1,1,1,1,3,1,1,2,1,1";
const sample = "3,4,3,1,2";
let samplefishes = sample.split(",").map(x => parseInt(x,10));

let fishes = input.split(",").map(x => parseInt(x,10));

let fishcount = [0,0,0,0,0,0,0,0,0];

let work = fishes;
fishcount = fishcount.map((v,i) => work.filter((v) => (v === i)).length);

for(var days = 0; days < 256; days++) {
    let newfishcount = [0,0,0,0,0,0,0,0,0];
    newfishcount[0] = fishcount[1];
    newfishcount[1] = fishcount[2];
    newfishcount[2] = fishcount[3];
    newfishcount[3] = fishcount[4];
    newfishcount[4] = fishcount[5];
    newfishcount[5] = fishcount[6];
    newfishcount[6] = fishcount[7] + fishcount[0];
    newfishcount[7] = fishcount[8];
    newfishcount[8] = fishcount[0];
    fishcount = newfishcount;
}
console.log(fishcount.reduce((p,c) => p + c));