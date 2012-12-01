meta["class"] = "PathRepository";
meta["category"] = "repository";
meta["public"] = ["fetchItem"];

o.init = function(options) {
    
    o.make = options.make;
    o.store = {};
    
}

o.make;
o.sotre;

o.fetchItem = function(id) {
    
    if (typeof o.store.id === "undefined") {
        o.store.id = o.make();
    }
  
    return o.store.id;
    
}
