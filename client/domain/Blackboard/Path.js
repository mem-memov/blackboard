meta["class"] = "Path";
meta["public"] = ["addDot"];

o.init = function(options) {

    o.id = options.id;
    o.dots = [];

}

o.id;
o.dots;

o.applyDotAddedToPath = function(event) {
    
    o.dots.push({
        x: event.getX(),
        y: event.getY()
    });
    
}

o.addDot = function(x, y) {

    app.fire("dotAddedToPath", {
        id: o.id,
        x: x,
        y: y
    });

}