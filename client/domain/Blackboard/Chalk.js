meta["class"] = "Chalk";
meta["public"] = ["draw", "move"];

o.init = function(options) {
    
    o.fetchPath = options.fetchPath;
    
}

o.pathId;
o.path;
o.fetchPath;

o.draw = function(x, y) {

    if (!o.path) {
        
        app.fire("chalkPathStarted", {
            id: app.generate(),
            x: x,
            y: y
        });
        
        o.path.addDot(x, y);
            
    } else {

        o.path.addDot(x, y);
        
    }
    
    return o.path;

}

o.move = function(x, y) {

    if (o.path) {
        
        o.path.addDot(x, y);
        
        app.fire("chalkPathFinished", {
            id: o.pathId,
            x: x,
            y: y
        });
    }

}

o.applyChalkPathStarted = function(event) {
    o.pathId = event.getId();
    o.path = o.fetchPath(o.pathId);
}

o.applyChalkPathFinished = function(event) {
    o.pathId = null;
    o.path = null;
}