meta = {
    "class": "Lecturer",
    "public": ["face", "touchWithHand", "withdrawHand", "moveHand", "knockWithHand"]
}
init = function(options) {
    
}

o.isTouching;
o.facedThing;
o.tool;
o.action;

o.face = function(thing, tool) {

    o.facedThing = thing;

    o.tool = tool;

    o.chooseAction();

}

o.touchWithHand = function(x, y) {

    o.isTouching = true;
    o.action.start(x, y);

}

o.withdrawHand = function(x, y) {

    o.isTouching = false;
    o.action.stop(x, y);

}

o.moveHand = function(x, y, continueMethod) {

    if (o.isTouching) {
        o.action.run(x, y);
    }

}

o.knockWithHand = function() {

}

o.chooseAction = function() {
    
    app.make(
        "LecturerDrawsWithChalkOnBoard", 
        {
            board: o.facedThing,
            chalk: o.tool
        },
        function(action) {
            o.action = action
        }
    );
    return;

    if (
        o.facedThing.__instanceOf("Board")
        && o.tool.__instanceOf("Chalk")
    ) {
        o.action = o.lecturerDrawsWithChalkOnBoard({
            board: o.facedThing,
            chalk: o.tool
        });
    }

    if (
        o.facedThing.__instanceOf("Board")
        && o.tool.__instanceOf("Board")
    ) {
        o.action = o.lecturerMovesBoard({
            board: o.facedThing
        });
    }

}
    