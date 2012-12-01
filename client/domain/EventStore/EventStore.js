meta["class"] = "EventStore";
meta["public"] = ["addEvent", "replayEvents"];

o.init = function(options) {
    o.store = {};
}

o.store;

o.addEvent = function(domainName, className, eventName, id, eventData) {
    
    if (typeof o.store[domainName] === "undefined") {
        o.store[domainName] = {};
    }
    if (typeof o.store[domainName][className] === "undefined") {
        o.store[domainName][className] = {};
    }
    if (typeof o.store[domainName][className][id] === "undefined") {
        o.store[domainName][className][id] = [];
    }
    
    o.store[domainName][className][id].push({
        eventName: eventName,
        eventData: eventData
    });
    //console.log(o.store);
}

o.replayEvents = function(domainName, className, base) {
    
}