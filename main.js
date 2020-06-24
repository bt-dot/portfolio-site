/*
    dropdown menu
*/
var open = false;
var toggle = function() {
    let getMenu = document.querySelector(".menu");

    if (!open) {
        getMenu.style.visibility = "visible";
        open = true;
    } else {
        getMenu.style.visibility = "hidden";
        open = false;
    }
}


/*
    8-puzzle game
*/
const ORIGINAL = [];
const SHUFFLED = document.querySelectorAll(".ps");
const EMPTYIMG = document.querySelector(".empty").src;

//load original with the correct ordering as soon as the web loads
//we could use this for checking hasWon, and reset. 
(function () {
    function setup() {
        for (let i = 0; i < SHUFFLED.length; i++) {
            ORIGINAL[i] = SHUFFLED[i].src;
            SHUFFLED[i].onclick = move;
        }
        document.querySelector("#shuffle").onclick = realShuffle;
        document.querySelector("#reset").onclick = reset;
    }
    window.onload = setup;
})();

//keep shuffling until a solvable board is generated
//update the new empty and moveable cells
var realShuffle = function() {
    shuffle();
    while (!solvable()) {
        shuffle();
    }
    clearPrev();
    findMoveables();
}

//shuffle the imgs by re-assigning img src to diff ids (fisher-yates algorithm)
var shuffle = function() {
    document.querySelector("#window p").innerHTML = "";
    for (let i = 0; i < SHUFFLED.length; i++) {
        var random = Math.floor((Math.random() * (SHUFFLED.length-i))) + i;
        var tmp = SHUFFLED[i].src;
        SHUFFLED[i].src = SHUFFLED[random].src;
        SHUFFLED[random].src = tmp;
    }
}

//check if the current shuffle is a solvable board by counting number of inversions
var solvable = function() {
    var inversions = 0;
    for (let i = 0; i < SHUFFLED.length; i++) {
        let cur = parseInt(SHUFFLED[i].src.substring(41, 42)); 
        //file names are labeled ps1, ps2, etc. 
        //use substring to get the numbers 
        if (cur === 9) { //9 is empty, so we skip that cell
            continue;
        }
        for (let j = i + 1; j < SHUFFLED.length; j++) {
            let rest = parseInt(SHUFFLED[j].src.substring(41, 42));
            if (rest === 9) {
                continue;
            }
            if (cur > rest) {
                inversions++;
            }
        }
    }
    if (inversions % 2 === 0) {
        return true;
    }
    return false;
}

//using the IIFE declared that loads original to reset the img scr
//assigned to each id. Reset empty and moveable cells
var reset = function() {
    document.querySelector("#window p").innerHTML = "";
    for (let i = 0; i < SHUFFLED.length; i++) {
        SHUFFLED[i].src = ORIGINAL[i];
    }
    clearPrev();
    findMoveables();
}

//swap a moveable with empty cell by switch img src
//find the next moveable cells and check if has won after the swap
var move = function() {
    if (this.classList.contains("canMove")) {
        var empty = findEmpty();
        empty.src = this.src;
        this.src = EMPTYIMG;
        
        if (hasWon()) {
            document.querySelector("#window p").innerHTML = "Congratulations! And thanks for stopping by!";
        } else {
            document.querySelector("#window p").innerHTML = "";
        }
        clearPrev();
        findMoveables();
    }
}

//using the IIFE declared that loads original to check with current 
//img src ordering to tell if the game is over
var hasWon = function() {
    for (let i = 0; i < SHUFFLED.length; i++) {
        if (ORIGINAL[i] !== SHUFFLED[i].src)
            return false;
    }
    return true;
}

var findEmpty = function() {
    for (let i = 0; i < SHUFFLED.length; i++) {
        if (SHUFFLED[i].src === EMPTYIMG) {
            return SHUFFLED[i];
        }
    }
}

//clear previous empty and canMove cells after a move. 
var clearPrev = function() {
    for (let i = 0; i < SHUFFLED.length; i++) {
        if (SHUFFLED[i].classList.contains("empty")) {
            SHUFFLED[i].classList.remove("empty");
        }
        if (SHUFFLED[i].classList.contains("canMove")) {
            SHUFFLED[i].classList.remove("canMove");
        }
    }
}

//find the empty slot from img src match, then use its id, which contains
//the col and row number to find adjcent cells. Update the adjacent cells
//class with 'canMove'.
var findMoveables = function() {
    var emptyEle = findEmpty();
    emptyEle.classList.add("empty");

    var row = parseInt(emptyEle.id.substring(1, 2));
    var col = parseInt(emptyEle.id.substring(2));
    var adjacentRow = [row+1, row-1];
    var adjacentCol = [col+1, col-1];
    var allMoveables = [];

    //moveable cells on the same col
    for (let i = 0; i < adjacentRow.length; i++) {
        if (adjacentRow[i] >= 0 && adjacentRow[i] < 3) {
            let moveable = "_" + adjacentRow[i] + col;
            allMoveables.push(moveable);
        }
    }

    //moveable cells on the same row
    for (let i = 0; i < adjacentCol.length; i++) {
        if (adjacentCol[i] >= 0 && adjacentCol[i] < 3) {
            let moveable = "_" + row + adjacentCol[i];
            allMoveables.push(moveable);
        }
    }
    
    //assigned class "canMove" to moveable cells
    for (let i = 0; i < SHUFFLED.length; i++) {
        for (let j = 0; j < allMoveables.length; j++) {
            if (SHUFFLED[i].id === allMoveables[j]) {
                SHUFFLED[i].classList.add("canMove");
            }
        }
    }
}