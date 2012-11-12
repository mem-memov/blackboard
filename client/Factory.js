({
    "class": "Factory",
    
    "constructor": function(options) {
        o.provideClass = options.provideClass;
    },
    
    "public make": function(className, options, onMake) {

        o.provideClass(
            className,
            function(_Class) {
                console.log(_Class);
            }
        );

    },
    
    "private provideClass": function() {}

})