meta["class"] = "Helper";
meta["public"] = ["connect", "command", "make", "fire"];

o.init = function(options) {
    
    o.domainName = options.domainName;
    o.className = options.className;
    o.issueCommand = options.issueCommand;
    o.makeInstance = options.makeInstance;
    o.fireEvent = options.fireEvent;
    
}

o.base;
o.meta;
o.domainName;
o.className;
o.issueCommand;
o.makeInstance;
o.fireEvent;

o.connect = function(base, meta) {
    o.base = base;
    o.meta = meta;
}

o.command = function(commandName, data) {
    o.issueCommand(o.domainName, commandName, data);
}

o.make = function(className, options) {
    return o.makeInstance(o.domainName, className, options);
}

o.fire = function(eventName, data) {
    if (typeof data === "undefined") {
        data = {};
    }
    o.fireEvent(o.domainName, o.className, eventName, o.base, data);
}

