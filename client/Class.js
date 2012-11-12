(function(options) {
    
    var o = {
        definition: null,
        Scope: null,
        className: null,
        constructorMethod: null,
        superClassName: null,
        members: {
            methods: {},
            properties: {}
        },
        visibility: {
            "public" : {},
            "private" : {},
            "protected": {}
        }
    };
    
    o.init = function(options) {
        
        o.setDefinition(options.text);
        
        o.analyzeDefinition();
        
        return {
            instantiateStandAloneClass: o.instantiateStandAloneClass
        };
        
    }
    
    o.setDefinition = function(text) {
        
        o.definition = (function(o) {
            
            return eval(text)
            
        })({});
        
        if (typeof o.definition["class"] === "undefined" || !o.definition["class"]) {
            throw new Error("Class definition without class name.");
        }
        
    }
    
    o.instantiateStandAloneClass = function(instanceOptions) {
        
        if (o.superClassName) {
            throw new Eroor(o.className + " doesn't stand alone.");
        }
        
        //---------------
        
        var scope = new o.Scope();

        var constructorMethod = o.constructorMethod;
        (function(o) {
            return new constructorMethod(instanceOptions);
        })(scope);
        
        //--------------------
        
        var instance = {};
        
        for (var key in o.visibility["public"]) {
            
            if (!o.visibility["public"].hasOwnProperty(key)) {
                continue;
            }
            
            instance[key] = scope[key];
            
        }

        return instance;
        
    };
    
    o.analyzeDefinition = function() {

        var
            key,
            analyzedKey
        ;
        
        o.Scope = function() {};

        for(key in o.definition) {
            
            if (!o.definition.hasOwnProperty(key)) {
                continue;
            }
                
            analyzedKey = o.analyzeDefinitionKey(key);

            // class
            if (analyzedKey.name === "class") {
                o.className = o.definition[key];
                continue;
            }

            // constructor
            if (analyzedKey.name === "constructor") {
                o.constructorMethod = o.definition[key];
                continue;
            }

            // super
            if (analyzedKey.name === "super") {
                o.superClassName = o.definition[key];
                continue;
            }

            // members
            if (typeof o.definition[key] === "function") {
                o.members.methods[analyzedKey.name] = o.definition[key];
            } else {
                o.members.properties[analyzedKey.name] = o.definition[key];
            }

            // visibility
            o.visibility[analyzedKey.visibility][analyzedKey.name] = o.definition[key];
            
            // base
            o.Scope.prototype[analyzedKey.name] = o.definition[key];
            
        }
      
    }

    
    o.analyzeDefinitionKey = function(key) {
        
        var 
            analyzedKey = {
                name: null,
                visibility: "private"
            },
            parts = key.split(" "),
            i,
            length = parts.length
        ;

        
        for(i=0; i<length; i++) {
            
            if (parts[i].length === 0) {
                continue;
            }
            
            if (i === (length-1)) {
                analyzedKey.name = parts[i];
                continue;
            }
            
            if (typeof o.visibility[parts[i]] !== "undefined") {
                analyzedKey.visibility = parts[i];
                continue;
            }
            
        }
        
        if (!analyzedKey.name) {
            throw new Error("No member name specified in class " + o.definition["class"]);
        }
        
        return analyzedKey;
        
    }
    
    return o.init(options);
    
})