meta = {
    "class": "Application"
}

init = function(options) {
    
    o.domain = options.domain;
    o.load = options.load;
    o.fetchClassDefinition = options.fetchClassDefinition;
    o.configurationPath = options.configurationPath;
    
    o.loadConfiguration(o.loadClass);

}

o.load;
o.fetchClassDefinition;
o.configurationPath;
o.configuration;
o.domain;
o.Class;

o.provideClass = function(className, onAvailable, onError) {
        
    if (typeof o.classes[className] !== "undefined") {

        onAvailable(o.classes[className]);

    } else {

        o.load(
            o.path + "/" + className + ".js",
            function(text) {
                o.classes[className] = new o.Class({
                    name: className,
                    text: text
                });
                onAvailable(o.classes[className]);
            }
        );

    }

};

o.loadConfiguration = function(onConfigurationLoaded) {
    
    o.load({
        path: o.configurationPath,
        onLoad: function(result) {
            
            o.configuration = eval(result.text);
            
            onConfigurationLoaded();

        }
    });
    
}

o.loadClass = function() {
    
    o.load({
        path: o.composePathForClass(o.domain + ".Class"),
        onLoad: function(result) {
            
            o.Class = o.fetchClassDefinition(result.text).init;

        }
    });
    
}

o.composePathForClass = function(fullClassName) {
/**
 * @param String fullClassName it starts with a domain name
 * @return String path to file with the class text
 */
    
    return o.configuration.path + "/" + fullClassName.replace(".", "/") + ".js";
    
}