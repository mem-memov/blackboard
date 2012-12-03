meta["class"] = "Drawing";

o.init = function(options) {

    o.id = options.id;
    
    o.setElementStyle();
    
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

o.createCurve = function(options) {

    var curve = o.curveCollection.createItem({
        container: o.element
    });

    options.addOnDotHandler(curve.draw);

}