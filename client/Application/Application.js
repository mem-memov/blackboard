meta = {
    "class": "Application"
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
o.commands = {};

o.sendQuery = function(name, data, onQuery) {
    
}

o.emptyFunction = function() {};

o.issueCommand = function(domainName, commandName, data, onDone, onError) {
    
    if (typeof data === "undefined") {
        data = {};
    }
    
    var command = new o.Command({
        data:data,
        commandName: commandName
    });
    
    if (typeof onDone === "undefined") {
        onDone = o.emptyFunction;
    }
    
    if (typeof onError === "undefined") {
       onError = o.emptyFunction;
    }
    
    if (typeof o.commands[domainName] === "undefined") {
        o.commands[domainName] = {};
    }
    
    if (typeof o.commands[domainName][commandName] !== "undefined") {
        o.commands[domainName][commandName](o.commandManager, command, onDone, onError);
    } else {

        o.load({
            path: o.composePathToCommandHandler(domainName, commandName),
            onLoad: function(result) {

                o.commands[domainName][commandName] = eval("(" + result.text + ")");
                o.commands[domainName][commandName](o.commandManager, command, onDone, onError);

            }
        });
        
    }

}

o.Command = function(options) {
    
    var o = {};
    o.commandName;
    o.publicMemebers = {};
    
    var init = function(options) {
        
        o.commandName = options.commandName;
        
        var getterName;

        for (var key in options.data) { 
            if (options.data.hasOwnProperty(key)) { 
                getterName = "get" + key.substr(0, 1).toUpperCase() + key.substr(1);
                o.publicMemebers[getterName] = o.makeGetter(options.data[key]);
            }
        }
        
        o.publicMemebers.hasName = o.hasName;
        
        return o.publicMemebers;
        
    }
    
    o.hasName = function(commandName) {
        return (o.commandName === commandName);
    }
    
    o.makeGetter = function(value) {
        return function() {
            return value;
        }
    }
    
    return init(options);
    
}

o.fireEvent = function(name, data) {
    
}

o.provideInstance = function(domainName, className, options, onAvailable, onError) {
    
    if (typeof options === "undefined") {
        options = {};
    }
    
    if (typeof onAvailable === "undefined") {
        onAvailable = o.emptyFunction;
    }
    
    if (typeof onError === "undefined") {
       onError = o.emptyFunction;
    }
    
    o.provideClass(
        domainName, 
        className, 
        function() {
            
            var definition = o.classes[domainName][className];
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
                
                for (var i=0, ln=definition.meta["public"].length; i<ln; i++) {
                    instance[definition.meta["public"][i]] = scope[definition.meta["public"][i]];
                }
                
            }
            
            onAvailable(instance);
            
        },
        onError
    );
    
}

o.provideClass = function(domainName, className, onAvailable, onError) {
        
    if (
            typeof o.classes[domainName] !== "undefined"
        &&  typeof o.classes[domainName][className] !== "undefined"
    ) {

        onAvailable(o.classes[domainName][className]);

    } else {

        o.load({
            path: o.composePathForClass(domainName, className),
            onLoad: function(result) {
                
                if (typeof o.classes[domainName] === "undefined") {
                    o.classes[domainName] = {};
                }
                
                var definition = o.fetchClassDefinition(result.text);
                
                definition.Scope = function(){};
                definition.Scope.prototype = definition.o;
                
                definition.app.command = function(command, data, onDone, onError) {
                    o.issueCommand(domainName, command, data, onDone, onError);
                }
                definition.app.make = function(className, options, onAvailable, onError) {
                    o.provideInstance(domainName, className, options, onAvailable, onError) 
                }
                    
                o.classes[domainName][className] = definition;
                
                onAvailable();
            }
        });

    }

};

o.loadConfiguration = function(onConfigurationLoaded) {
    
    o.load({
        path: o.configurationPath,
        onLoad: function(result) {
            
            o.configuration = eval(result.text);
            
            o.commandManager = {
                make: o.provideInstance,
                makeSingleton: function(domainName, className, options, onAvailable, onError) {
                    
                    if (typeof o.singletons[domainName] === "undefined") {
                        o.singletons[domainName] = {};
                    }
                    
                    if (typeof o.singletons[domainName][className] !== "undefined") {
                        onAvailable(o.singletons[domainName][className]);
                        return;
                    }
                    
                    if (typeof o.singletons[domainName][className] === "undefined") {
                        o.provideInstance(
                            domainName, 
                            className, 
                            options, 
                            function(instance) {
                                o.singletons[domainName][className] = instance;
                                onAvailable(o.singletons[domainName][className]);
                            }, 
                            onError
                        );
                    }

                }
            }
            
            o.issueCommand(
                o.domainName,
                "start"
            );

        }
    });
    
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