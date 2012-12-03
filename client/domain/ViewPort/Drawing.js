meta["class"] = "Drawing";
meta["public"] = ["addCurve", "draw"];

o.init = function(options) {
 
    o.curves = [];

    o.id = options.id;
    o.curveFactory = options.curveFactory;
    
    o.setElementStyle();
    
}

o.id;
o.color = "#003300";
o.curves;
o.curveFactory;
o.currentFocus;


o.setElementStyle = function() {
    
    app.command(
        "setDomElementStyle",
        {
            id: o.id,
            style: {
                "background-color": o.color
            }
        }
    );
    
}

o.addCurve = function(x, y) {

    app.fire("curveAddedToDrawing", {
        x: x,
        y: y
    });

}

o.applyCurveAddedToDrawing = function(event) {
    
    var curve = o.curveFactory.make(event.getX(), event.getY(), o.id);
    
    o.currentFocus = curve;

    o.curves.push(curve);

}

o.draw = function(x, y) {
    o.currentFocus.draw(x, y);
}

