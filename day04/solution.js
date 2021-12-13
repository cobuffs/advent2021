const fs = require('fs');
//let contents = fs.readFileSync("adv01.txt", 'utf8').trim();
const entries = fs.readFileSync('input.txt', 'utf8').toString().trim().split("\r\n");

let numstodraw = entries[0].split(",").map(x => parseInt(x,10));
let numlocs = new Map();
let winningboards = [];
let boards = [];

for(var i = 1; i < entries.length; i++) {
    if(entries[i] === "") continue;
    //we've got a 5x5 board
    let board = [];
    for(var j = 0; j < 5; j++) {
        let temp = entries[i].split(" ");
        let row = [];
        for(var k = 0; k < temp.length; k++) {
            if(temp[k] !== "") {
                let cell = {
                    "num": parseInt(temp[k],10),
                    "selected": false        
                };
                row.push(cell);
                //store off the number for later access
                let boardloc = {"boardnum":boards.length, "row": j, "col": row.length-1};
                if (numlocs.has(cell.num)) {
                    let numpt = numlocs.get(cell.num);
                    numpt.entries.push(boardloc);
                } else {
                    let tempent = [];
                    tempent.push(boardloc);
                    numlocs.set(cell.num, {"entries": tempent});
                }
            }
        }
        board.push(row);

        i++;
    }
    boards.push(board);
}

//start popping numbers, flipping them to selected, and checking for bingos
let bingo = false;
while(numstodraw.length > 0) {
    let numcalled = numstodraw.shift();
    //find them all and mark them selected
    let cellstoupdate = numlocs.get(numcalled);
    for(var i = 0; i < cellstoupdate.entries.length; i++) {
        let entry = cellstoupdate.entries[i];
        boards[entry.boardnum][entry.row][entry.col].selected = true;
        bingo = lookforbingo(boards[entry.boardnum]);
        if(bingo) {
            if(!winningboards.includes(entry.boardnum)) {
                console.log(`BINGO: Board ${entry.boardnum} with num ${numcalled}`);
                console.log(findsumofunmarkednumbersforboard(boards[entry.boardnum]) * numcalled);
                winningboards.push(entry.boardnum);
            }
        }
    }
}

function lookforbingo(board){
    //check if any rows or cols are all selected
    //check rows
    for(var i = 0; i < 5; i++) {
        let rowselected = 0;
        let colselected = 0;
        for(var j = 0; j < 5; j++) {
            let cell = board[i][j];
            if(cell.selected) rowselected++;
            let cell2 = board[j][i];
            if(cell2.selected) colselected++;
        }
        if(rowselected == 5 || colselected == 5) return true;
    }
}

function findsumofunmarkednumbersforboard(board) {
    let sum = 0;
    for(var i = 0; i < 5; i++) {
        for(var j = 0; j < 5; j++) {
            let cell = board[i][j];
            if(!cell.selected) sum += board[i][j].num;
        }
    }
    return sum;
}