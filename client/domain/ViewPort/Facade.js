meta["class"] = "Facade";
meta["category"] = "facade";
meta["public"] = ["makeDrawing"];

o.init = function(options) {
    
    o.unique = {};
    o.drawings = {};
    
}

o.unique;
o.drawings;

o.makeDrawing = function(id) {
    
    if (!o.drawings[id]) {
        o.drawings[id] = app.make("Drawing", {
            id: id,
            curveFactory: o.makeCurveFactory()
        });
    }

    return o.drawings[id];
    
}

o.makeCurveFactory = function() {
    return o.makeUniqueInstance("CurveFactory", {
        svg: o.makeSvg()
    });
}

o.makeSvg = function() {
    return o.makeUniqueInstance("Svg");
}

o.makeUniqueInstance = function(className, instanceOptions) {
    
    if (typeof o.unique[className] === "undefined") {
        
        o.unique[className] = app.make(className, instanceOptions);
        
    }
    
    return o.unique[className];
    
}


