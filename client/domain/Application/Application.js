meta["class"] = "Application";
meta["public"] = ["init"]


o.init = function(options, configuration) {

    o.mustShowEventsInConsole = configuration.mustShowEventsInConsole;
    o.domainName = options.domain;
    o.load = options.load;
    o.pathToCommandHandlers = configuration.pathToCommandHandlers;
    o.pathToEventHandlers = configuration.pathToEventHandlers;

    o.makeInstance = function(domainName, className, instanceOptions) { 
        
        // enable communication with the application level
        var app = options.makeInstance(o.domainName, "Helper", {
            domainName: domainName,
            className: className,
            issueCommand: o.issueCommand,
            makeInstance: o.makeInstance,
            fireEvent: o.fireEvent
        });

        return options.makeInstance(domainName, className, instanceOptions, app);
    }

    o.commandManager = {
        make: o.makeInstance,
        makeSingleton: function(domainName, className, options) {

            if (typeof o.singletons[domainName] === "undefined") {
                o.singletons[domainName] = {};
            }

            if (typeof o.singletons[domainName][className] === "undefined") {
                o.singletons[domainName][className] = o.makeInstance(domainName, className, options);
            }
            
            return o.singletons[domainName][className];

        }
    }

    o.issueCommand(
        o.domainName,
        "start"
    );

}

o.makeInstance;
o.load;
o.domainName;
o.commandManager;
o.mustShowEventsInConsole;

o.singletons = {};
o.commandHandlers = {};
o.eventHandlers = {};

o.sendQuery = function(name, data, onQuery) {
    
}

o.emptyFunction = function() {};

o.issueCommand = function(domainName, commandName, data) {

    if (typeof data === "undefined") {
        data = {};
    }

    var command = o.makeInstance(
        o.domainName, 
        "Command", 
        {
            data: data,
            commandName: commandName
        }
    );

    var handle = o.provideCommandHandler(domainName, commandName);

    handle(o.commandManager, command);

}

o.fireEvent = function(domainName, className, eventName, base, data) {
    
    if (typeof data === "undefined") {
        data = {};
    }
    
    var event = o.makeInstance(
        o.domainName, 
        "Event", 
        {
            data: data,
            eventName: eventName
        }
    );
        
    var applyMethodName = "apply" + eventName.substr(0,1).toUpperCase() + eventName.substr(1);
    if (typeof base[applyMethodName] === "undefined") {
        console.error(domainName + "." + className + " has no " + applyMethodName + "(event) method.");
    }
    base[applyMethodName](event);
        
    var handle = o.provideEventHandler(domainName, eventName);
    
    if (o.mustShowEventsInConsole) {
        console.log(domainName + "." + className + " fires " + eventName + " event with this data:");
        console.log(data);
    }
    
    handle(event);
    
}

o.provideCommandHandler = function(domainName, commandName) {
    
    if (typeof o.commandHandlers[domainName] === "undefined") {
        o.commandHandlers[domainName] = {};
    }
    
    if (typeof o.commandHandlers[domainName][commandName] === "undefined") {

        var path = o.pathToCommandHandlers + "/" + domainName + "/" + commandName + ".js";
        var text = o.load(path);
        
        o.commandHandlers[domainName][commandName] = eval("(" + text + ")");

    }
    
    return o.commandHandlers[domainName][commandName];
    
}

o.provideEventHandler = function(domainName, eventName) {
    
    if (typeof o.eventHandlers[domainName] === "undefined") {
        o.eventHandlers[domainName] = {};
    }
    
    if (typeof o.eventHandlers[domainName][eventName] === "undefined") {

        var path = o.pathToEventHandlers + "/" + domainName + "/" + eventName + ".js";
        var text = o.load(path);
        
        o.eventHandlers[domainName][eventName] = eval("(" + text + ")");

    }
    
    return o.eventHandlers[domainName][eventName];
    
}

