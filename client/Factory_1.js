meta = {
    "class": "Factory",
    "public": ["make"],
    "protected": []
}
init = function(options) {

    o.path = options.path;
    o.loader = options.loader;
    o.Class = options.Class;

}

o.path;
o.loader;
o.Class;
o.classes;

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
