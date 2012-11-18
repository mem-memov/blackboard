meta = {
    "class": "Class"
};

init = function(options) {

    o.fetchClassDefinition = options.fetchClassDefinition;
    
    o.fetchDefinition(options.text);

    o.setScope();

    return {
        instantiate: o.instantiate
    };

}

o.members;
o.Scope;
o.name;
o.superName;
o.publicMemberNames;

o.instantiate = function(instanceOptions) {

    if (o.superName) {
        console.error(o.name + " doesn't stand alone.");
    }

    //---------------

    var scope = new o.Scope();

    (function(init, o, options) {

        init(options);

    })(o.init, scope, instanceOptions);

    //--------------------

    var instance = {};

    for (var i=0, ln=o.publicMemberNames.length; i<ln; i++) {

        instance[o.publicMemberNames[i]] = scope[o.publicMemberNames[i]];

    }

    return instance;

};

o.fetchDefinition = function(text) {

    var definition = (function(text) { 

        var 
            meta, 
            init, 
            o = {}
        ;

        eval(text);

        return {
            meta: meta,
            init: init,
            o: o
        }

    })(text);


    o.init = definition.init;
    o.members = definition.o;

    o.analyzeMetaData(definition.meta);

}

o.analyzeMetaData = function(meta) {

    if (meta["class"]) {
        o.name = meta["class"];
    } else {
        console.error("Class definition without class name.");
    }

    if (meta["public"]) {
        o.publicMemberNames = meta["public"];
    } else {
        o.publicMemberNames = [];
    }

    if (meta["extends"]) {
        o.superName = meta["extends"];
    }

}

o.setScope = function() {

    o.Scope = function() {};
    o.Scope.prototype = o.members;

}
