meta["class"] = "Svg";
meta["public"] = ["createElement"];

o.init =  function() {
    
}


o.createElement = function(data) {
    
    //Defining the SVG Namespace
    var svgNS = "http://www.w3.org/2000/svg";
    //Creating a Document by Namespace
    var element = document.createElementNS(svgNS, data.type);

    if (data.attributes) {
        for (var key in data.attributes) {
            if (data.attributes.hasOwnProperty(key)) {
                element.setAttribute(key, data.attributes[key]);
            }
        }
    }
       
    if (data.containerId) {
        var container = document.getElementById(data.containerId);
        container.appendChild(element);
    }

    return element;
    
}