meta = {
    "class": "Command",
    "public": "publicMemebers"
}
init = function(options) {

    o.commandName = options.commandName;

    var getterName;

    for (var key in options.data) { 
        if (options.data.hasOwnProperty(key)) { 
            getterName = "get" + key.substr(0, 1).toUpperCase() + key.substr(1);
            o.publicMemebers[getterName] = o.makeGetter(options.data[key]);
        }
    }

    o.publicMemebers.hasName = o.hasName;

}

o.commandName;
o.publicMemebers = {};

o.hasName = function(commandName) {
    return (o.commandName === commandName);
}

o.makeGetter = function(value) {
    return function() {
        return value;
    }
}