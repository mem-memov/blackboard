meta["class"] = "Lecturer";
meta["public"] = ["face", "touchWithHand", "withdrawHand", "moveHand", "knockWithHand"];

o.init = function(options) {
  
}

o.isTouching;
o.facedThing;
o.toolTray;
o.tool;
o.action;

o.face = function(thing, toolTray) {

    o.facedThing = thing;

    o.toolTray = toolTray;

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

o.moveHand = function(x, y) {

    if (o.isTouching) {
        o.action.run(x, y);
    }

}

o.knockWithHand = function(x, y) {
    
    o.action = app.make(
        "LecturerTakesToolFromTray", 
        {
            
        }
    );
    
}

o.chooseAction = function() {
    
    o.tool = o.toolTray.giveTool("chalk");

    o.action = app.make(
        "LecturerDrawsWithChalkOnBoard", 
        {
            board: o.facedThing,
            chalk: o.tool
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
    