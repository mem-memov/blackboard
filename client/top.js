(function(applicationOptions) {
    
    var application = {
        loader: null,
        Class: null,
        classes: {}
    };
   
    application.init = function(applicationOptions) {

        application.loader = new application.Loader({});
        
        application.loader.load(
            applicationOptions.path + "/" + "Class.js",
            application.onClassLoad
        );
        
    };
    
    application.onClassLoad = function(text) {

        application.Class = eval(text);

        application.provideClass(
            "Factory",
            application.onFactoryAvailable
        );
        
    };
    
    application.onFactoryAvailable = function(Factory) {

        var o = {}; // while text has an object in brackets. There references to a variable 

        var factory = Factory.instantiate({
            path: applicationOptions.path,
            loader: application.loader,
            Class: application.Class
        })

        factory.make(
            "EventBus", 
            {
                path: applicationOptions.path,
                factory: factory,
                loader: application.loader
            },
            function(eventBus) {
                eventBus.fireEvent("start");
            }
        );

    };
    
    application.provideClass = function(className, onAvailable) {
        
        if (typeof application.classes[className] !== "undefined") {
            
            onAvailable(application.classes[className]);
            
        } else {

            application.loader.load(
                applicationOptions.path + "/" + className + ".js",
                function(text) {
                    application.classes[className] = new application.Class({
                        name: className,
                        text: text
                    });
                    onAvailable(application.classes[className]);
                }
            );
            
        }
        
    };

    application.Loader = function(loaderOptions) {
        
        var loader = {};

        loader.init = function(loaderOptions) {

            return {
                load: loader.load
            };
            
        };
        
        loader.getHttpRequest = function() {
            
            var xmlHttpFactories = [
                function () {return new XMLHttpRequest()},
                function () {return new ActiveXObject("Msxml2.XMLHTTP")},
                function () {return new ActiveXObject("Msxml3.XMLHTTP")},
                function () {return new ActiveXObject("Microsoft.XMLHTTP")}
            ];

            var httpRequest = false;
            
            for (var i=0; i<xmlHttpFactories.length; i++) {
                try {
                    httpRequest = xmlHttpFactories[i]();
                }
                catch (e) {
                    continue;
                }
                break;
            }
            
            if (httpRequest === false) {
                throw new Error('This browser does not support XMLHttpRequest.');
            }
            
            return httpRequest;

        };
        
        loader.load = function(url, onLoad){

            var httpRequest = loader.getHttpRequest();

            httpRequest.onreadystatechange = function() {

                if ( httpRequest.readyState == 4 ) {
                    
                    if ( 
                            httpRequest.status == 200 
                        ||  httpRequest.status == 304 
                    ) {

                        onLoad(httpRequest.responseText);
                        
                    } else {
                        
                        console.log( 
                            'XML request error: ' 
                            + httpRequest.statusText 
                            + ' (' + httpRequest.status + ')' 
                        ) ;
                    }
                    
                }
            }
            
            httpRequest.open('GET', url, false);
            httpRequest.send(null);
            
        };
        
        return loader.init(loaderOptions);
        
    };
    
    application.init(applicationOptions);
    
})({
    path: '/client'
});
