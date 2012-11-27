meta["class"] = "Event";
meta["public"] = [];

o.init = function(options) {

    o.eventName = options.eventName;
    o.makeGetters(options.data || {});

}

o.eventName;

o.hasName = function(eventName) {
    return (o.eventName === eventName);
}

o.makeGetters = function(data) {
    
    var getterName;
    
    for (var key in data) {
        
        if (!data.hasOwnProperty(key)) {
            continue;
        }
        
        getterName = "get" + key.substr(0,1).toUpperCase() + key.substr(1);
        
        o[getterName] = o.makeGetter(data[key]);
        
        if (meta["public"].indexOf(getterName) === -1) {
            meta["public"].push(getterName);
        }

    }
   
}

o.makeGetter = function(value) {
    return function() {
        return value;
    }
}





