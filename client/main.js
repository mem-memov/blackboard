/**
 * Loading text files and fetching class definitions is the basis of an application.
 * Nothing should leak into global namespace.
 */
(function(options) {

    var Loader = function(options) {
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

        o.load = function(loadOptions){
        /**
         * @param Object   loadOptions
         * @param String   loadOptions.path
         * @param Function loadOptions.onLoad({text: String, load: Function})
         * @param Function loadOptions.onError({path: String, status: Number, statusText: String})
         */

            // check the path to the file to be loaded
            if (typeof loadOptions.path === "undefined") {
                console.error("No path has been provided for loading.");
            }

            // check preloaded texts and use them when present
            if (typeof o.preloadedTexts[loadOptions.path] !== "undefined") {

                loadOptions.onLoad({
                    text: o.preloadedTexts[loadOptions.path],
                    load: o.load
                });
                return;
            }
            
            // check the handler of errors that happen when loading files
            if (typeof loadOptions.onError === "undefined") {
                loadOptions.onError = o.defaultOnError;
            }

            // create AJAX transport
            var httpRequest = o.makeHttpRequest();

            httpRequest.onreadystatechange = function() {

                if ( httpRequest.readyState == 4 ) {
                    
                    if ( 
                            httpRequest.status == 200 
                        ||  httpRequest.status == 304 
                    ) {

                        if (typeof loadOptions.onLoad === "function") {
                            loadOptions.onLoad({
                                text: httpRequest.responseText,
                                load: o.load
                            });
                        }
                        
                    } else {

                        if (typeof loadOptions.onError === "function") {
                            loadOptions.onError({
                                path: loadOptions.path, 
                                status: httpRequest.status, 
                                statusText: httpRequest.statusText
                            });
                        }
                    }
                    
                }
            }
            
            // communicate with the server
            httpRequest.open('GET', loadOptions.path, false);
            httpRequest.send(null);
            
        };
        
        o.defaultOnError = function(error) {
        /**
         * It handles load errors when no custom error handler has been provided
         */
        
            console.error( 
                'XML request error: ' 
                + error.statusText 
                + ' (' + error.status + ')' 
            );

        }

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

    new Loader({
        preloadedTexts: options.preloadedTexts
    }).load({
        path: options.path,
        onLoad: options.onLoad
    });
    
})({
    
    path: "/client/Application/Application.js",
    
    onLoad: function(result) {

        // show how class code should be defined
        var fetchClassDefinition = function(text) { 

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
        
        // start application
        fetchClassDefinition(result.text).init(
            {
                load: result.load,
                fetchClassDefinition: fetchClassDefinition,
                configurationPath: "/client/configuration.js",
                domain: "Application"
            }
        );
        
    },
    
    preloadedTexts: {
        //"/client/Application.js": ""
    }
    
});