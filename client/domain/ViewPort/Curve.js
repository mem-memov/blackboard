meta["class"] = "Curve";
meta["public"] = ["draw"];

o.init =  function(options) {
   
    o.element = options.element;
    o.draw(options.x, options.y);

}

o.element;

o.draw = function(x, y) {

    var d = o.element.getAttribute("d") + " L" + x + " " + y;
    o.element.setAttribute("d", d);

}