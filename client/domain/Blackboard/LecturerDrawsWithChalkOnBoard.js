meta["class"] = "LecturerDrawsWithChalkOnBoard";
meta["extends"] = "Action";
meta["public"] = ["start", "run", "stop"];

o.init = function(options) {
 
    o.board = options.board;
    o.chalk = options.chalk;
    
}

o.board;
o.chalk;

o.start = function(x, y) {

    o.board.addPath(
        o.chalk.draw(x, y)
    );

}

o.run = function(x, y) {

    o.chalk.draw(x, y);

}

o.stop = function(x, y) {

    o.chalk.move(x, y);

}