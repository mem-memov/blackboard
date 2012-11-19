meta = {
    "class": "Application",
    "requires": ["Command"]
}

init = function(options) {
    
    o.domainName = options.domain;
    o.load = options.load;
    o.fetchClassDefinition = options.fetchClassDefinition;
    o.configurationPath = options.configurationPath;
    
    o.loadConfiguration();
    


}

o.load;
o.fetchClassDefinition;
o.configurationPath;
o.configuration;
o.domainName;
o.commandManager;
o.classes = {};
o.singletons = {};
o.commandHandlers = {};

o.sendQuery = function(name, data, onQuery) {
    
}

o.emptyFunction = function() {};

o.issueCommand = function(domainName, commandName, data) {
   
    if (typeof data === "undefined") {
        data = {};
    }
    
    if (typeof o.commandHandlers[domainName] === "undefined") {
        o.commandHandlers[domainName] = {};
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

o.makeInstance = function(domainName, className, options) {
    
    if (typeof options === "undefined") {
        options = {};
    }

    var definition = o.provideClassDefinition(domainName, className);
    var scope = new definition.Scope();

    (function(init, o, options, app) {

        init(options);

    })(
        definition.init, 
        scope, 
        options,
        definition.app
    );

    var instance = {};

    if (typeof definition.meta["public"] !== "undefined") {

        if (typeof definition.meta["public"] === "string") {

            instance = scope[definition.meta["public"]];

        } else { // array

            for (var i=0, ln=definition.meta["public"].length; i<ln; i++) {
                instance[definition.meta["public"][i]] = scope[definition.meta["public"][i]];
            }

        }

    }
    
    return instance;
    
}

o.provideClassDefinition = function(domainName, className) {
    
    if (typeof o.classes[domainName] === "undefined") {
        o.classes[domainName] = {};
    }
        
    if (typeof o.classes[domainName][className] === "undefined") {

        var text = o.load(o.composePathForClass(domainName, className));

        var definition = o.fetchClassDefinition(text);

        definition.app.command = function(commandName, data, onDone, onError) {
            o.issueCommand(domainName, commandName, data, onDone, onError);
        }
        definition.app.make = function(className, options, onAvailable, onError) {
            o.makeInstance(domainName, className, options, onAvailable, onError) 
        }

        definition.Scope = function(){};
        definition.Scope.prototype = definition.o;

        o.classes[domainName][className] = definition;

    }
    
    return o.classes[domainName][className];

};

o.provideCommandHandler = function(domainName, commandName) {
    
    if (typeof o.commandHandlers[domainName][commandName] === "undefined") {

        var path = o.composePathToCommandHandler(domainName, commandName);
        var text = o.load(path);
        
        o.commandHandlers[domainName][commandName] = eval("(" + text + ")");

    }
    
    return o.commandHandlers[domainName][commandName];
    
}

o.loadConfiguration = function(onConfigurationLoaded) {

    o.configuration = eval(o.load(o.configurationPath));

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


o.composePathForClass = function(domainName, className) {
/**
 * @param String className
 * @param String domainName
 * @return String path to file with the class text
 */
    
    return o.configuration.path + "/" + domainName + "/" + className.replace(".", "/") + ".js";
    
}

o.composePathToCommandHandler = function(domainName, commandName) {
    
    return o.configuration.path + "/commandHandler/" + domainName + "/" + commandName + ".js";
    
}