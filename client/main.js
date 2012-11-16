(function(options) {

    var Loader = function(options) {
    /**
     * Loader of text files
     */
    
        var o = {
            preloadedTexts: {} // path: "escapedTextFromFile""
        };

        o.init = function(options) {

            if (typeof options.preloadedTexts !== "undefined") {
                o.preloadedTexts = options.preloadedTexts;
            }

            return {
                load: o.load
            };
            
        };

        o.load = function(loadOptions){
        /**
         * @param Object loadOptions
         * @param String loadOptions.path
         * @param Function loadOptions.onLoad({text: String, load: Function})
         * @param Function loadOptions.onError({path: String, status: Number, statusText: String})
         */

            if (typeof loadOptions.path === "undefined") {
                console.error("No path has been provided for loading.");
            }

            if (typeof o.preloadedTexts[loadOptions.path] !== "undefined") {
                loadOptions.onLoad({
                    text: o.preloadedTexts[loadOptions.path],
                    load: o.load
                });
                return;
            }
            
            if (typeof loadOptions.onError === "undefined") {
                loadOptions.onError = o.defaultOnError;
            }

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
            
            httpRequest.open('GET', loadOptions.path, false);
            httpRequest.send(null);
            
        };
        
        o.defaultOnError = function(error) {

            console.error( 
                'XML request error: ' 
                + error.statusText 
                + ' (' + error.status + ')' 
            );

        }

        o.makeHttpRequest = function() {
            
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
        
        return o.init(options);
        
    };

    new Loader({
        preloadedTexts: options.preloadedTexts
    }).load({
        path: options.path,
        onLoad: options.onLoad,
        onError: options.onError
    });
    
})({
    path: "/client/Application.js",
    onLoad: function(result) {
       
        var instantiate = function(text, options) {
            eval("(" +
                "    function(options) { " + 
                "        var o = {}; " + 
                "        var init = function(options){ return{}; }; " + 
                         text + 
                "        return init(options); " +
                "    }" +
            ")")(options);
        }
        
        instantiate(
            result.text,
            {
                load: result.load,
                instantiate: instantiate,
                configurationPath: "/client/configuration.js"
            }
        );
        
    },
    preloadedTexts: {
        //"/client/Application.js": ""
    }
});