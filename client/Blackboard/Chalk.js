meta["class"] = "Chalk";
meta["public"] = ["draw", "move"];

o.init = function(options) {
    
}

o.path;

o.draw = function(x, y) {

    if (!o.path) {
        
        app.make(
            "Path",
            {},
            function(path) {
                o.path = path;
                o.path.addDot(x, y);
            }
        );
            
    } else {
        
        o.path.addDot(x, y);
        
    }

    //return o.path;

}

o.move = function(x, y) {

    if (o.path) {
        o.path = null;
    }

}