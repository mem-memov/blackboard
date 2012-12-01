meta["class"] = "Helper";
meta["public"] = [
    "connect", "command", "make", "fire", "showMember", "hideMember", "generate"
];

o.init = function(options) {
    
    o.domainName = options.domainName;
    o.className = options.className;
    o.issueCommand = options.issueCommand;
    o.makeInstance = options.makeInstance;
    o.fireEvent = options.fireEvent;
    o.provideId = options.provideId;
    
}

o.base;
o.instance;
o.meta;
o.domainName;
o.className;

o.issueCommand;
o.makeInstance;
o.fireEvent;
o.provideId;

o.connect = function(base, instance, meta) {
    o.base = base;
    o.instance = instance;
    o.meta = meta;
}

o.showMember = function(memberName) {
    o.instance[memberName] = o.base[memberName];
}

o.hideMember = function(memberName) {
    delete(o.instance[memberName]);
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

o.generate = function() {
    return o.provideId(o.domainName, o.className);
}



