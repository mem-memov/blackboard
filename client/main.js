/**
 * Loading text files and fetching class definitions is the basis of an application.
 * Nothing should leak into global namespace.
 */
(function(options) {

    var makeClass = function(text, meta) { 
    // show how class code should be defined

        eval(text.substr(0, text.indexOf("o."))); // fill meta data
    
        return function(app, meta) { // meta is made inaccessible

            var o = this;

            eval(text.substr(text.indexOf("o."))); // build instance

            return o;

        }

    };

    // provide code loader
    var Loader = function(options) {
    /**
     * Loader of text files
     */
    
        var o = {}, init, meta;
        
        meta = {
            "class": "Loader"
        };

        init = function(options) {

            if (typeof options.pathToPreloadedTexts !== "undefined") {
                o.preloadedTexts = eval(o.load(options.pathToPreloadedTexts));
            }

            return {
                load: o.load
            };
            
        };
        
        o.preloadedTexts = {}; // path: "escapedTextFromFile""

        o.load = function(path){
        
            var exchange = {
                path: path
            }
            
            o.realLoad(exchange);
            
            return exchange.result;
            
        };

        o.realLoad = function(loadOptions){
        /**
         * Load files with code in a synchronous manner
         * @param Object   loadOptions
         * @param String   loadOptions.path
         * @param String   loadOptions.result the return value
         */

            // check the path to the file to be loaded
            if (typeof loadOptions.path === "undefined") {
                console.error("No path has been provided for loading.");
            }

            // check preloaded texts and use them when present
            if (typeof o.preloadedTexts[loadOptions.path] !== "undefined") {

                // return a preloaded result
                loadOptions.result = o.preloadedTexts[loadOptions.path];

                return;
                
            }

            // create AJAX transport
            var httpRequest = o.makeHttpRequest();

            httpRequest.onreadystatechange = function() {

                if ( httpRequest.readyState == 4 ) {
                    
                    if ( 
                            httpRequest.status == 200 
                        ||  httpRequest.status == 304 
                    ) {

                        // return the loaded result
                        loadOptions.result = httpRequest.responseText;
                        
                    } else {

                        // notify about a loading error
                        console.error( 
                            'XML request error: ' 
                            + error.statusText 
                            + ' (' + error.status + ')' 
                        );
                            
                    }
                    
                }
            }
            
            // communicate with the server
            httpRequest.open('GET', loadOptions.path, false);
            httpRequest.send(null);
            
            // Prevent potential IE memory leak
            xhr = null;
            
        };

        o.makeHttpRequest = function() {
        /**
         * It creates AJAX transport in a cross-browser fashion
         */
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
        
        return init(options);
        
    };
    var loader = new Loader({
        pathToPreloadedTexts: options.pathToPreloadedTexts
    });
    
    // load configuration
    var configuration = eval(loader.load(options.configurationPath));
    
    // make factory
    var text = loader.load(options.factoryPath);
    var Factory = makeClass(text, {}, {});
    var factory = new Factory();
    factory.init({
        load: loader.load,
        makeClass: makeClass,
        configuration: configuration
    });

    // start application
    var application = factory.makeInstance("Application", "Application", {
        load: loader.load,
        domain: "Application",
        makeInstance: factory.makeInstance
    });

})({
    
    factoryPath: "/client/domain/Application/Factory.js",
    configurationPath:  "/client/configuration.js",
    pathToPreloadedTexts: "/client/preload.js"
    
});