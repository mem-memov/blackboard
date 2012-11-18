meta = {
    "class": "LecturerDrawsWithChalkOnBoard",
    "super": "Action",
    "public": ["start", "run", "stop"]
}
init = function(options) {
    
     o.board = options.board;
     o.chalk = options.chalk;
    
}

o.board;
o.chalk;

o.start = function(x, y) {

    console.log("Lecturer prepares for drawing with chalk on the board.");

    o.board.showPath(
        o.chalk.draw(x, y)
    );

}

o.run = function(x, y) {

    console.log("Lecturer draws with chalk on the board.");

    o.board.showPath(
        o.chalk.draw(x, y)
    );


}

o.stop = function(x, y) {

    console.log("Lecturer stops drawing with chalk on the board.");

    o.chalk.move(x, y);

}