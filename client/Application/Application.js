meta["class"] = "Application";


o.init = function(options) {
    
    o.domainName = options.domain;
    o.load = options.load;
    o.makeClass = options.makeClass;
    o.configurationPath = options.configurationPath;
    
    o.loadConfiguration();

}

o.load;
o.makeClass;
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

    var base = new definition.ConstructorMethod();
    
    if (typeof base.init !== "function") {
        console.error("Class without init method: " + domainName + "." + className);
    }
    
    base.init(options);

    var instance = {}; // TODO: inheritance goes here

    if (typeof definition.meta["public"] !== "undefined") {

        if (typeof definition.meta["public"] === "string") { // a dynamic collection of public members

            instance = base[definition.meta["public"]];

        } else { // array

            for (var i=0, ln=definition.meta["public"].length; i<ln; i++) {
                instance[definition.meta["public"][i]] = base[definition.meta["public"][i]];
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

        // load class text
        var text = o.load(o.composePathForClass(domainName, className));
        
        // fetch the constructor and provide class context
        var meta = {};
        var app = {};
        var ConstructorMethod = o.makeClass(text, meta, app);
        
        // enable communication with the application level
        app.command = function(commandName, data) {
            o.issueCommand(domainName, commandName, data);
        }
        app.make = function(className, options) {
            return o.makeInstance(domainName, className, options) 
        }
        
        // fill meta data
        ConstructorMethod(); 
        
        // check that there is no 'var meta' or 'meta = {...}' inside the code of the class
        var metaIsDefinedCorrectly = false;
        for (var key in meta) {
            metaIsDefinedCorrectly = true;
            break;
        }
        if (!metaIsDefinedCorrectly) {
            console.error("The object with meta data can't be redefined in " + domainName + "." + className + ". Write like this: meta[\"class\"] = \"" + className + "\".")
        }
        
        
        // put the definition into the class buffer
        o.classes[domainName][className] = {
            meta: meta,
            ConstructorMethod: ConstructorMethod
        };

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