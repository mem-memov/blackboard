({

    "class": "EventBus",
    
    "private handlers": null,
    "private listeners": null,
    
    "constructor": function(eventBusOptions) {

        o.path = eventBusOptions.path;
        o.load = eventBusOptions.load;
        o.make = eventBusOptions.make;
        
    },
    

    "public fireEvent": function(eventName, eventData) {

        if (typeof eventData === "undefined") {
            eventData = {};
        }

        console.log(eventName + ' fired with this data:');
        console.log(eventData);

        if (typeof o.handlers[eventName] === "undefined") {
            o.loader.load(
               o.buildPathToEventFile(eventName),
               function(text) {
                   o.handlers[eventName] = eval("(" + text + ")");
                   o.runHandler(eventName, eventData);
               }
            );
        } else {
            o.runHandler(eventName, eventData);
        }

    },
    
    "private load": function() {},
    "private make": function() {},

    "private subscribe": function(eventName, listener) {

        if (typeof o.listeners[eventName] == "undefined") {
            o.listeners[eventName] = [];
        }

        o.listeners[eventName].push(listener);

    },

    "private publish": function(eventName, eventData) {

        var results = [];

        for (var i = 0; i < o.listeners[eventName].length; i++) {
            results.push(
                o.listeners[eventName][i](eventData)
            );
        }

        return results;

    },

    "private runHandler": function(eventName, eventData) {

        o.handlers[eventName](
            eventData,
            {
                subscribe: o.subscribe,
                publish: o.publish,
                make: o.make
            }
        );

    },

    "private buildPathToEventFile": function(eventName) {

        return o.path + '/application/' + eventName + '.js';

    }

})