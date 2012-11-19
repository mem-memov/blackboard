meta = {
    "class": "Command",
    "public": "publicMemebers"
}

init = function(options) {

    o.commandName = options.commandName;
    
    o.publicMemebers = {}; // new object for each instance

    var getterName;

    for (var key in options.data) { 

        if (!options.data.hasOwnProperty(key)) { 
            continue;
        }
        
        getterName = "get" + key.substr(0, 1).toUpperCase() + key.substr(1);

        var value = options.data[key];

        o.publicMemebers[getterName] = o.makeGetter(value);
        
    }

    o.publicMemebers.hasName = o.hasName;

}

o.commandName;
o.publicMemebers;

o.hasName = function(commandName) {
    return (o.commandName === commandName);
}

o.makeGetter = function(value) {
    

    return (function(value) { 
        
        return function() {
            return value;
        }
        
    })(value);
    
}