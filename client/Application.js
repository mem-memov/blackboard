init = function(options) {
    
    options.load({
        path: options.configurationPath,
        onLoad: function(result) {
            
            var configuration = eval(result.text);
            
            o.path = configuration.path;
            
            console.log(o);
            
        }
    });

}

o.path = null;

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