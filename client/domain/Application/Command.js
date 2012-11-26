meta["class"] = "Command";
meta["public"] = ["hasName", "get"];

o.init = function(options) {

    o.commandName = options.commandName;
    o.data = options.data || {};

}

o.commandName;
o.data;

o.hasName = function(commandName) {
    return (o.commandName === commandName);
}

o.get = function(key) {

    if (typeof o.data[key] === "undefined") {
        console.error("Unknown key '" + key + "' in '" + o.commandName + "' command.");
    }
    
    return o.data[key];
    
}


