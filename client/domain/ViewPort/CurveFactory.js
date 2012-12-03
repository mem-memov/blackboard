meta["class"] = "CurveFactory";
meta["category"] = "factory";
meta["public"] = ["make"];

o.init = function(options) {
    
    o.svg = options.svg;
    
}

o.svg;

o.make = function(x, y, containerId) {
   
    var element = o.svg.createElement({
        type: "path",
        attributes: {
            "d": "M" + (x-1) + " " + (y-1),
            "stroke": "white",
            "stroke-width": 1,
            "fill": "none",
            "result": null
        },
        containerId: containerId
    });
    
    return app.make("Curve", {
        element: element,
        x: x,
        y: y
    });
    
}