meta["class"] = "Chalk";
meta["public"] = ["draw", "move"];

o.init = function(options) {
    
    o.fetchPath = options.fetchPath;
    
}

o.path;
o.fetchPath;

o.draw = function(x, y) {

    if (!o.path) {
        
        app.fire("chalkPathStarted", {
            id: app.generate()
        });
        
        o.path.addDot(x, y);
            
    } else {

        o.path.addDot(x, y);
        
    }
    
    return o.path;

}

o.move = function(x, y) {

    if (o.path) {
        app.fire("chalkPathFinished");
    }

}

o.applyChalkPathStarted = function(event) {
    o.path = o.fetchPath(event.getId());
}

o.applyChalkPathFinished = function(event) {
    o.path = null;
}