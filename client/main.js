/**
 * Loading text files and fetching class definitions is the basis of an application.
 * Nothing should leak into global namespace.
 */
(function(options) {

    this.fetchClassDefinition = function(text) { 
    // show how class code should be defined
    
        var 
            meta, 
            init, 
            o = {},
            app = {}
        ;

        eval(text);

        return {
            meta: meta,
            init: init,
            o: o,
            app: app
        }

    }

    this.Loader = function(options) {
    /**
     * Loader of text files
     */
    
        var o = {}, init, meta;
        
        meta = {
            "class": "Loader"
        };

        init = function(options) {

            if (typeof options.preloadedTexts !== "undefined") {
                o.preloadedTexts = options.preloadedTexts;
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

    var loader = new this.Loader({
        preloadedTexts: options.preloadedTexts
    });
    
    var text = loader.load(options.path);

    // start application
    fetchClassDefinition(text).init(
        {
            load: loader.load,
            fetchClassDefinition: this.fetchClassDefinition,
            configurationPath: options.configurationPath,
            domain: options.domain
        }
    );

})({
    
    path: "/client/Application/Application.js",
    configurationPath:  "/client/configuration.js",
    domain: "Application",
    preloadedTexts: {
        //"/client/Application.js": ""
    }
    
});