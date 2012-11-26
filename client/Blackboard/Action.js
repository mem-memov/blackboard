meta["class"] = "Action";
meta["protected"] = ["start", "run", "stop"];

o.init = function(options) {
    
}

o.start = function(x, y) {

    console.log("Action started.");

}

o.run = function(x, y) {

    console.log("Action running.");

}

o.stop = function(x, y) {

    console.log("Action stopped.");

}