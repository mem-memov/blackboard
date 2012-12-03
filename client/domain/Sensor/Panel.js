meta["class"] = "Panel";

o.init = function(options) {
    
    o.id = options.id;
    
    o.setElementListeners();
    
}

o.id;

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
        "touchPanelWithHand",
        {
            x: x,
            y: y
        }
    );
    
}

o.onMouseUp = function(x, y) {
    
    app.command(
        "withdrawHandFromPanel",
        {
            x: x,
            y: y
        }
    ); 
    
}

o.onMouseMove = function(x, y) {
  
    app.command(
        "moveHandAbovePanel",
        {
            x: x,
            y: y
        }
    ); 
    
}

o.onDoubleClick = function(x, y) {

    app.command(
        "knockOnPanelWithHand",
        {
            x: x,
            y: y
        }
    ); 
    
}
