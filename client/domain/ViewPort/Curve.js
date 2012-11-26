meta["class"] = "Curve";

o.init =  function(options) {
    
}

o.draw = function(x, y) {

    if (!o.element) {

        o.element = o.createSvgElement({ // <-------
            type: "path",
            attributes: {
                "d": "M" + x + " " + y,
                "stroke": "white",
                "stroke-width": 1,
                "fill": "none",
                "result": null
            },
            container: o.container
        });

    } else {

        var d = o.element.getAttribute("d") + " L" + x + " " + y;
        o.element.setAttribute("d", d);

    }

}