meta["class"] = "Application";
meta["public"] = ["init"]


o.init = function(options, configuration) {

    o.makeInstance = function(domainName, className, instanceOptions) { 
        
        var app = {};
        // enable communication with the application level
        app.command = function(commandName, data) {
            o.issueCommand(domainName, commandName, data);
        }
        app.make = function(className, options) {
            return o.makeInstance(domainName, className, options);
        }
        
        return options.makeInstance(domainName, className, instanceOptions, app);
    }
    
   
    o.domainName = options.domain;
    o.load = options.load;
    o.pathToCommandHandlers = configuration.pathToCommandHandlers;
    o.pathToEventHandlers = configuration.pathToEventHandlers;
    

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

o.singletons = {};
o.commandHandlers = {};

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

o.fireEvent = function(name, data) {
    
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

