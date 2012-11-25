meta["class"] = "Drawing";

o.init = function(options) {

    o.id = options.id;
    
    o.setElementStyle();
    o.setElementListeners();
    
    return o;
    
}

o.id;
o.color = "#003300";

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

o.setElementListeners = function() {
    
    app.command(
        "addListenerToDomElement",
        {
            id: o.id,
            event: "mouseDown",
            listener: o.onMouseDown
        }
    );
    
    app.command(
        "addListenerToDomElement",
        {
            id: o.id,
            event: "mouseUp",
            listener: o.onMouseUp
        }
    );
    
    app.command(
        "addListenerToDomElement",
        {
            id: o.id,
            event: "mouseMove",
            listener: o.onMouseMove
        }
    );
    
    app.command(
        "addListenerToDomElement",
        {
            id: o.id,
            event: "doubleClick",
            listener: o.onDoubleClick
        }
    );
    
}

o.onMouseDown = function(x, y) {
    
    app.command(
        "touchDrawingWithHand",
        {
            x: x,
            y: y
        }
    );
    
}

o.onMouseUp = function(x, y) {
    
    app.command(
        "withdrawHandFromDrawing",
        {
            x: x,
            y: y
        }
    ); 
    
}

o.onMouseMove = function(x, y) {
  
    app.command(
        "moveHandAboveDrawing",
        {
            x: x,
            y: y
        }
    ); 
    
}

o.onDoubleClick = function(x, y) {

    app.command(
        "knockOnDrawingWithHand",
        {
            x: x,
            y: y
        }
    ); 
    
}

o.createCurve = function(options) {

    var curve = o.curveCollection.createItem({
        container: o.element
    });

    options.addOnDotHandler(curve.draw);

}