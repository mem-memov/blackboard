meta["class"] = "Factory";

o.init = function(options) {

    o.load = options.load;
    o.makeClass = options.makeClass;
    o.configuration = options.configuration;
    
    o.classes = {};
    o.mixins = {};
    
}

o.classes;
o.mixins;
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
    var base = new definition.ConstructorFunction(context); 

    // check init function
    if (typeof base.init !== "function") {
        console.error("Class without init method in " + domainName + "." + className + ". Write after meta data: o.init = function(options, configuration) { ... }");
    }
    
    // initialize base object
    base.init(options, configuration); // give the base object control over public methods

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
        var text = o.load(o.composePath(domainName, className));
        
        // fetch the constructor and meta data
        var meta = {};
        var ConstructorFunction = o.makeClass(text, meta);
        o.checkMetaData(meta);
        
        if (typeof meta["class"] === "undefined") {
            console.error("Meta parameter 'class' is missing in " + domainName + "." + className + ". Write at the top: meta[\"class\"] = \"" + className + "\";");
        }
 
        // include mixed in code
        if (meta["includes"]) {
            text = o.includeMixins(text, meta, domainName); // meta is modified as well
            ConstructorFunction = o.makeClass(text, {}); // {} in place of meta preserves the modifications
        }

        // inherit from a super class
        if (meta["extends"]) {
            o.extendSuperClass(domainName, meta["extends"], ConstructorFunction);
        }

        // put the definition into the class cache
        o.classes[domainName][className] = {
            meta: meta,
            ConstructorFunction: ConstructorFunction
        };

    }
    
    return o.classes[domainName][className];

}

o.checkMetaData = function(meta) {
/**
 * check that there is no 'var meta' or 'meta = {...}' inside the code text
 */
    
    var metaIsDefinedCorrectly = false;
    for (var key in meta) {
        metaIsDefinedCorrectly = true;
        break;
    }
    if (!metaIsDefinedCorrectly) {
        console.error("The object with meta data can't be redefined in " + domainName + "." + className + ". Write like this: meta[\"class\"] = \"" + className + "\".")
    }
    
}

o.extendSuperClass = function(domainName, superClassName, ConstructorFunction) {
    
        var superDefinition = o.provideClassDefinition(domainName, superClassName);
        var superBase = new superDefinition.ConstructorFunction();

        var superInstance = ConstructorFunction.prototype; // never redefine prototypes with freshly created objects because the constructor changes
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

o.includeMixins = function(text, meta, domainName) {
    
    var i, ln, mixinDefinition;
    
    for (var i=0, ln=meta["includes"].length; i<ln; i++) {
        
        mixinDefinition = o.provideMixinDefinition(domainName, meta["includes"][i]);

        // add code text
        text += mixinDefinition.text;
        
        // add public members to class
        if (typeof mixinDefinition.meta["public"] !== "undefined") {
            if (typeof meta["public"] === "undefined") {
                meta["public"] = [];
            }
            meta["public"] = o.mergeArrays(meta["public"], mixinDefinition.meta["public"]);
        }
        
        // add protected members to class
        if (typeof mixinDefinition.meta["protected"] !== "undefined") {
            if (typeof meta["protected"] === "undefined") {
                meta["protected"] = [];
            }
            meta["protected"] = o.mergeArrays(meta["protected"], mixinDefinition.meta["protected"]);
        }

    }
  
    return text;
    
}

o.mergeArrays = function(a1, a2) {
    
    for (var i=0, ln=a2.length; i<ln; i++) {
        if (a1.indexOf(a2[i]) === -1) {
            a1.push(a2[i]);
        }
    }
    
    return a1;
    
}

o.provideMixinDefinition = function(domainName, mixinName) {
    
    if (typeof o.mixins[domainName] === "undefined") {
        o.mixins[domainName] = {};
    }
        
    if (typeof o.mixins[domainName][mixinName] === "undefined") {
        
        // load mixin text
        var text = o.load(o.composePath(domainName, mixinName));
        
        // fetch meta data
        var meta = {};
        var ConstructorFunction = o.makeClass(text, meta);
        
        o.checkMetaData(meta);
        
        // fetch member names
        var memberNames = [];
        var temporaryObject = ConstructorFunction.apply({}); // 'apaly' prevents cluttering of global namespace
        for (var key in temporaryObject) {
            if (temporaryObject.hasOwnProperty(key)) {
                memberNames.push(key);
            }
        }
        
        if (typeof meta["mixin"] === "undefined") {
            console.error("Meta parameter 'mixin' is missing in " + domainName + "." + mixinName + ". Write at the top: meta[\"mixin\"] = \"" + mixinName + "\";");
        }
        
        // put the definition into the mixin cache
        o.mixins[domainName][mixinName] = {
            meta: meta,
            text: " \n" + text.substr(text.indexOf("o.")),
            memberNames: memberNames
        };
        
    }
    
    return o.mixins[domainName][mixinName];
    
}

o.composePath = function(domainName, className) {
/**
 * @param String className
 * @param String domainName
 * @return String path to file with the class text
 */
    
    return o.configuration.Application.Factory.pathToDomains + "/" + domainName + "/" + className.replace(".", "/") + ".js";
    
}