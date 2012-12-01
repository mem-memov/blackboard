meta["class"] = "PathFactory";
meta["category"] = "factory";
meta["public"] = ["make"];

o.init = function() {
    
}

o.make = function(pathOptions) {
    
    if (typeof pathOptions === "undefined") {
        pathOptions = {};
    }
    
    return app.make("Path", pathOptions);
    
}