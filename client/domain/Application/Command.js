meta["class"] = "Command";
meta["public"] = [];

o.init = function(options) {

    o.commandName = options.commandName;
    o.makeGetters(options.data || {});

}

o.commandName;

o.hasName = function(commandName) {
    return (o.commandName === commandName);
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



