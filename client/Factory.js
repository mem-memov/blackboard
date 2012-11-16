(function(options) {
    
    var o = {
        path: null,
        loader: null,
        Class: null,
        classes: null,
    };

    o.init = function(options) {
        
        o.path = options.path;
        o.loader = options.loader;
        o.Class = options.Class;
        
        return {
            make: o.make
        };
        
    };

    o.make = function(className, options, onMake) {

        if (typeof o.classes[className] === "undefined") {
            o.loader.load(
                o.buildPathToClassFile(className),
                function(classText) {
                    o.addClass(classText);
                    o.makeInstance(className, options, onMake);
                }
            );
        } else {
            return o.makeInstance(className, options, onMake);
        }

    }

    o.makeInstance = function(className, options, onMake) {

        // ...
        var instance = {test: 1};

        onMake(instance);

    }

    o.addClass = function(classText) {

        var define = o.define;

        eval(classText);

    }

    o.define = function(description) {

        o.classes[description["class"]] = description;

    }

    o.buildPathToClassFile = function(fullClassName) {

        return o.path + "/" + fullClassName.replace(".", "/") + ".js";

    }


    return o.init(options);
    
})


