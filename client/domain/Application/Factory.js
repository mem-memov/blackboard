meta["class"] = "Factory";

o.init = function(options) {

    o.load = options.load;
    o.makeClass = options.makeClass;
    o.configuration = options.configuration;
    
    o.classes = {};
    
}

o.classes;
o.load;
o.makeClass;

o.makeInstance = function(domainName, className, options, context) {

    // define initialization options
    if (typeof options === "undefined") {
        options = {};
    }
    
    // define context
    if (typeof context === "undefined") {
        context = {};
    }
    
    // fetch configuration
    var configuration = {};
    if (o.configuration[domainName] && o.configuration[domainName][className]) {
        configuration = o.configuration[domainName][className];
    }
    
    // create instance
    var instance = {};

    // fetch class definition
    var definition = o.provideClassDefinition(domainName, className);

    // create base object
    var base = new definition.ConstructorMethod(context);
    
    // TODO: give the base object controle over public methods
    // base.__.instance = instance;

    // check init function
    if (typeof base.init !== "function") {
        console.error("Class without init method: " + domainName + "." + className);
    }
    
    // initialize base object
    base.init(options, configuration);

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
    if (typeof meta["extends"] !== "undefined") {
        resultArray = o.collectPublicMembers(domainName, meta["extends"]);
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
        var ConstructorMethod = o.makeClass(text, meta);

        // fill meta data and prevent leakage to global namespace
        var tmp = {};
        ConstructorMethod.apply(tmp);

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
        if (meta["extends"]) {
            var superDefinition = o.provideClassDefinition(domainName, meta["extends"]);
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
        
        // include mixed in code
        if (meta["includes"]) {
            for (var i=0, ln=meta["includes"].length; i<ln; i++) {
                
            }
        }

        // put the definition into the class cache
        o.classes[domainName][className] = {
            meta: meta,
            ConstructorMethod: ConstructorMethod
        };

    }
    
    return o.classes[domainName][className];

}

o.composePathForClass = function(domainName, className) {
/**
 * @param String className
 * @param String domainName
 * @return String path to file with the class text
 */
    
    return o.configuration.Application.Factory.pathToDomains + "/" + domainName + "/" + className.replace(".", "/") + ".js";
    
}