(function(applicationOptions) {
    
    var application = {};
   
    application.init = function(applicationOptions) {

        var loader = new application.Loader({});
        
        var factory = new application.Factory({
            path: applicationOptions.path,
            loader: loader
        });
        
        new application.EventBus({
            path: applicationOptions.path,
            factory: factory,
            loader: loader
        }).fireEvent("start");
        
    };
    
    application.Factory = function(factoryOptions) {
        
        var factory = {
            path: null,
            loader: null,
            classes: {}
        };
        
        factory.init = function(factoryOptions) {
            
            factory.path = factoryOptions.path;
            factory.loader = factoryOptions.loader;
            
            return {
                make: factory.make
            }
            
        };
        
        factory.make = function(className, options, onMake) {

            if (typeof factory.classes[className] === "undefined") {
                factory.loader.load(
                    factory.buildPathToClassFile(className),
                    function(classText) {
                        factory.addClass(classText);
                        factory.makeInstance(className, options, onMake);
                    }
                );
            } else {
                return factory.makeInstance(className, onMake);
            }

        };
        
        factory.makeInstance = function(className, options, onMake) {
            
            // ...
            var instance = {test: 1};
            
            onMake(instance);
            
        };
        
        factory.addClass = function(classText) {
            
            var define = factory.define;
            
            eval(classText);
            
        };
        
        factory.define = function(description) {
            
            factory.classes[description["class"]] = description;
            
        };
        
        factory.buildPathToClassFile = function(fullClassName) {
            
            return factory.path + "/" + fullClassName.replace(".", "/") + ".js";
            
        };
        
        return factory.init(factoryOptions);
        
    };
    
    application.EventBus = function(eventBusOptions) {
    
        var eventBus = {
            path: null,
            loader: null,
            factory: null,
            handlers: {},
            listeners: {}
        };

        eventBus.init = function(eventBusOptions) {
            
            eventBus.path = eventBusOptions.path;
            eventBus.loader = eventBusOptions.loader;
            eventBus.factory = eventBusOptions.factory;
            
            return {
                fireEvent: eventBus.fireEvent
            };
            
        };
        
        eventBus.subscribe = function(eventName, listener) {
            
            if (typeof eventBus.listeners[eventName] == "undefined") {
                eventBus.listeners[eventName] = [];
            }
            
            eventBus.listeners[eventName].push(listener);
            
        };
        
        eventBus.publish = function(eventName, eventData) {
            
            var results = [];
            
            for (var i = 0; i < eventBus.listeners[eventName].length; i++) {
                results.push(
                    eventBus.listeners[eventName][i](eventData)
                );
            }
            
            return results;
            
        };

        eventBus.fireEvent = function(eventName, eventData) {
            
            if (typeof eventData === "undefined") {
                eventData = {};
            }

            console.log(eventName + ' fired with this data:');
            console.log(eventData);

            if (typeof eventBus[eventName] === "undefined") {
                eventBus.loader.load(
                   eventBus.buildPathToEventFile(eventName),
                   function(text) {
                       eventBus.handlers[eventName] = eval("(" + text + ")");
                       eventBus.runHandler(eventName, eventData);
                   }
                );
            } else {
                eventBus.runHandler(eventName, eventData);
            }
            
        };
        
        eventBus.runHandler = function(eventName, eventData) {
            
            eventBus.handlers[eventName](
                eventData,
                {
                    subscribe: eventBus.subscribe,
                    publish: eventBus.publish,
                    make: eventBus.factory.make
                }
            );
            
        };
        
        eventBus.buildPathToEventFile = function(eventName) {
            
            return eventBus.path + '/application/' + eventName + '.js';
            
        };
        
        
        
        return eventBus.init(eventBusOptions);
        
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
