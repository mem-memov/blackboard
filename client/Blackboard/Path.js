meta = {
    "class": "Path",
    "public": ["addDot"]
}
init = function(options) {
    
}

o.dots = [];

o.applyDotAdded = function(dotAdded) {
    
}

o.addDot = function(x, y) {

    o.dots.push({
        x: x,
        y: y
    });

/*
    for (var i = 0; i < o.onDotHandlers.length; i++) {
        o.onDotHandlers[i](x, y);
    }
*/
}