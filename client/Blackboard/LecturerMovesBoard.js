meta["class"] = "LecturerMovesBoard";
meta["super"] = "Action";
meta["public"] = ["start", "run", "stop"];

o.init = function(options) {
    
     o.board = options.board;
    
}

o.start = function(x, y) {

    console.log("Lecturer prepares for moving the board.");

}

o.run = function(x, y) {

    console.log("Lecturer moves the board.");

    o.board.move(x, y);

}

o.stop = function(x, y) {

    console.log("Lecturer stops moving the board.");

}