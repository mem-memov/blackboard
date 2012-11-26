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

    // define initialization options
    if (typeof options === "undefined") {
        options = {};
    }
    
    // create instance
    var instance = {};

    // fetch class definition
    var definition = o.provideClassDefinition(domainName, className);

    // create base object
    var base = new definition.ConstructorMethod();
    
    // TODO: give the base object controle over public methods
    // base.__.instance = instance;

    // check init function
    if (typeof base.init !== "function") {
        console.error("Class without init method: " + domainName + "." + className);
    }
    
    // initialize base object
    base.init(options);

    // transfer public members from the base object
    var publicMemberNames = o.collectPublicMembers(domainName, className);
    for (var i=0, ln=publicMemberNames.length; i<ln; i++) {
        instance[publicMemberNames[i]] = base[publicMemberNames[i]];
    }

    return instance;
    
}

o.collectPublicMembers = function(domainName, className) {

    var meta = o.provideClassDefinition(domainName, className).meta;
    
    var resultArray;
    if (typeof meta["super"] !== "undefined") {
        resultArray = o.collectPublicMembers(domainName, meta["super"]);
    } else {
        resultArray = [];
    }

    if (typeof meta["public"] !== "undefined") {

        for (var i=0, ln=meta["public"].length; i<ln; i++) {
            if (resultArray.indexOf(meta["public"][i]) === -1) {
                resultArray.push(meta["public"][i]);
            }
        }

    }

    return resultArray;
    
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
        
        // inherit from a super class
        if (meta["super"]) {
            var superDefinition = o.provideClassDefinition(domainName, meta["super"]);
            var superBase = new superDefinition.ConstructorMethod();
            
            var superInstance = ConstructorMethod.prototype; // never redefine prototypes with freshly created objects because the constructor changes
            superInstance.init = superBase.init;
            
            if (superDefinition.meta["public"]) {
                for (var i=0, ln=superDefinition.meta["public"].length; i<ln; i++) {
                    superInstance[superDefinition.meta["public"][i]] =superBase[superDefinition.meta["public"][i]];
                }
            }
            if (superDefinition.meta["protected"]) {
                for (var i=0, ln=superDefinition.meta["protected"].length; i<ln; i++) {
                    superInstance[superDefinition.meta["protected"][i]] =superBase[superDefinition.meta["protected"][i]];
                }
            }

        }
        
        
        // put the definition into the class cache
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