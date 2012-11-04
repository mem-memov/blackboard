DddCompact = function(domains, events) {    var application = {        namespaces: {},        domains: {},        eventBus: null,        loader: null,        id: 1    };    application.init = function(domains, events) {        application.eventBus = new application.EventBus({            makeInstanceMethod: application.makeInstance,            events: events        });        application.loader = new application.Loader();                for (var domainName in domains) {            if (domains.hasOwnProperty(domainName)) {                                application.namespaces[domainName] = {};                application.loader.loadScript(                    domains[domainName], // url                    application.namespaces[domainName]                );                        }        }        return {            makeInstance: application.makeInstance        }    };    application.makeInstance = function(domainName, className, instanceOptions) {            var domain = application.makeDomain(domainName);                var instance = domain.makeInstance(className, instanceOptions);            return instance;    };        application.makeDomain = function(domainName) {            if (!application.namespaces[domainName]) {            throw new Error("No namespace has been defined for " + domainName + " domain");        }        if (!application.domains[domainName]) {            application.domains[domainName] = new application.Domain({                domainName: domainName,                namespace: application.namespaces[domainName],                eventBus: application.eventBus,                provideIdMethod: application.provideId            });        }                return application.domains[domainName];        };    application.provideId = function() {                return application.id++;            }        application.Domain = function(domainOptions) {        var domain = {            factory: null        };        domain.init = function(domainOptions) {                        domain.factory = new domain.Factory({                domainName: domainOptions.domainName,                namespace: domainOptions.namespace,                eventBus: domainOptions.eventBus,                provideIdMethod: domainOptions.provideIdMethod            });            return  {                makeInstance: domain.makeInstance            }                    };        domain.makeInstance = function(className, instanceOptions) {                    var compound = domain.factory.makeCompound(className, instanceOptions);                        return compound.instance;                    };                domain.Factory = function(factoryOptions) {            var factory = {                domainName: null,                namespace: null,                eventBus: null,                cores: []            };                        factory.init = function(factoryOptions) {                                factory.domainName = factoryOptions.domainName;                factory.namespace = factoryOptions.namespace;                factory.eventBus = factoryOptions.eventBus;                factory.provideIdMethod = factoryOptions.provideIdMethod;                                return {                    makeCompound: factory.makeCompound,                    makeCollection: factory.makeCollection                };            };                        factory.provideIdMethod = function() {};                        factory.makeCore = function(className, instanceOptions, insider) {                                var core = new domain.Core({                    factory: factory,                    domainName: factory.domainName,                    className: className,                    id: factory.provideIdMethod(),                    instanceOptions: instanceOptions,                    fireEventMethod: factory.makeFiringMethod(className),                    makeCollectionMethod: factory.makeCollection,                    makeCompoundMethod: factory.makeCompound,                    insider: insider                });                                factory.cores.push(core);                                return core;                            };                        factory.makeCompound = function(className, instanceOptions, insider) {                                if (typeof factory.namespace[className] !== "function") {                    throw new Error("Class '" + className + "' is not defined in any of domains.");                }                if (typeof instanceOptions == "undefined") {                    instanceOptions = {};                }                            if (typeof insider == "undefined") {                    insider = {};                }                var core = factory.makeCore(className, instanceOptions, insider);                var instance = new factory.namespace[className](insider);                                core.finishDefinition(instance);                core.acceptMixins(instance);                return {                    instance: instance,                    core: core                };                            };                        factory.findCore = function(instance) {                for (var i in factory.cores) {                                        if (factory.cores[i].hasInstance(instance)) {                        return factory.cores[i];                    }                                    }                                return null;                            };                        factory.makeCollection = function(itemClass) {                            var collection = new domain.Collection({                    eventBus: factory.eventBus,                    itemFactoryMethod: function(record) {                        return factory.makeCompound(itemClass, record);                    },                    findCoreMethod: function(item) {                        return factory.findCore(item);                    },                    fireEventMethod: factory.makeFiringMethod(itemClass)                });                                return collection;                            };            factory.makeFiringMethod = function(itemClass) {                return function(eventName, eventData) {                    if (typeof eventData == 'undefined') {                        var eventData = {};                    }                    eventData.domainName = factory.domainName;                    eventData.itemClass = itemClass;                    return factory.eventBus.fireEvent(eventName, eventData);                };                            };                        return factory.init(factoryOptions);                    };        domain.Core = function(coreOptions) {            var core = {                instanceOptions: null,                id: null,                domainName: null,                className: null,                insider: null,                instance: null,                parent: null,                idFieldName: null,                fieldNames: [],                requiredFieldNames: [],                publicMembers: {},                definitionMethodNames: [                    "defineIdField",                     "defineField",                    "defineRequiredField",                    "defineCollection",                    "defineMessages",                    "defineEvents",                    "defineMixins",                    "defineParent"                ],                startMethodNames: [                    "finishDefinition"                ],                endMethodNames: [                    "hasInstance",                    "getRecord",                    "getIdFieldName",                    "acceptMixins",                    "mixinMyInsiderInto"                ],                mixinNames: []            };            core.init = function(coreOptions) {                core.instanceOptions = coreOptions.instanceOptions;                core.id = coreOptions.id;                core.makeCollectionMethod = coreOptions.makeCollectionMethod;                core.makeCompoundMethod = coreOptions.makeCompoundMethod;                core.fireEventMethod = coreOptions.fireEventMethod;                core.domainName = coreOptions.domainName;                core.className = coreOptions.className;                core.insider = coreOptions.insider;                                core.putDefinitionMethods();                for (var i = 0, ln = core.startMethodNames.length; i < ln; i++) {                    core.publicMembers[core.startMethodNames[i]] = core[core.startMethodNames[i]];                }                                return core.publicMembers;            };            core.makeCollectionMethod = function() {};                        core.makeCompoundMethod = function() {};                        core.fireEventMethod = function() {};                        core.putDefinitionMethods = function(insider) {                for (var i = 0, ln = core.definitionMethodNames.length; i < ln; i++) {                    core.insider[core.definitionMethodNames[i]] = core[core.definitionMethodNames[i]];                }            };                        core.defineIdField = function(idFieldName) {                core.defineField(idFieldName);                core.idFieldName = idFieldName;            };            core.defineRequiredField = function(requiredFieldName) {                                core.defineField(requiredFieldName);                core.requiredFieldNames.push(requiredFieldName);                             if (typeof core.instanceOptions[requiredFieldName] == 'undefined') {                    throw new Error(                        'When creating '                        + core.domainName                        + '.'                        + core.className                        + ' objects you must provide a value for the "'                        + requiredFieldName                        + '" field.'                    );                }                            }                        core.defineField = function(fieldName, defaultValue) {                            if (typeof defaultValue == "undefined") {                    defaultValue = null;                }                                var fieldValue = defaultValue;                            if (core.fieldNames[fieldName]) {                    throw new Error(                        "Field "                         + core.domainName                        + "." + core.className                         + "." + fieldName                         + " cannot be redefined."                    );                }                                core.fieldNames.push(fieldName);                if (typeof core.instanceOptions[fieldName] !== 'undefined') {                    fieldValue = core.instanceOptions[fieldName];                }                            core.addInsiderMember(fieldName, fieldValue);                            };            core.defineCollection = function(collectionName, collectionClass) {                            var collection = core.makeCollectionMethod(collectionClass);                core.addInsiderMember(collectionName, collection);                            };                        core.defineMessages = function() {                                var messageNames = arguments;                                for (var i in messageNames) {                    core.addInsiderMember(messageNames[i], function(data) {                                            });                }                            };                        core.defineEvents = function() {                                var eventNames = arguments;                                var factory = function(eventName) {                    return function (data) {                        return core.fireEventMethod(eventName, data);                    }                }                                for (var i in eventNames) {                    core.addInsiderMember(eventNames[i], factory(eventNames[i]));                }                            };                        core.defineMixins = function() {                                var mixinNames = arguments;                for (var i = 0,ln = mixinNames.length; i < ln; i++) {                                        core.mixinNames.push(mixinNames[i]);                }            };                        core.defineParent = function(className) {                                core.parent = core.makeCompoundMethod(className).instance;                core.insider._parent = core.parent;                core.insider.constructor.prototype = core.parent;            };                        core.finishDefinition = function(instance) {                              var i, ln;                core.instance = instance;                                for (var i = 0, ln = core.definitionMethodNames.length; i < ln; i++) {                    delete(core.insider[core.definitionMethodNames[i]]);                }                                for (var i = 0, ln = core.startMethodNames.length; i < ln; i++) {                    delete(core.publicMembers[core.startMethodNames[i]]);                }                                for (var i = 0, ln = core.endMethodNames.length; i < ln; i++) {                    core.publicMembers[core.endMethodNames[i]] = core[core.endMethodNames[i]];                }                        };                        core.hasInstance = function(instance) {                return (instance === core.instance);                            }                        core.getRecord = function() {                                var record = {};                                for (var i in core.fieldNames) {                                        record[core.fieldNames[i]] = core.insider[core.fieldNames[i]];                                    }                                return record;                            }                        core.getIdFieldName = function() {                return core.idFieldName;            }                        core.acceptMixins = function(instance) {                                var                    i,                    ln,                    mixinCompound,                    property                ;                                for (var i = 0, ln = core.mixinNames.length; i < ln; i++) {                                        mixinCompound = core.makeCompoundMethod(core.mixinNames[i], {}, core.insider);                                        // public members                    for (property in mixinCompound.instance) {                                                if (!mixinCompound.instance.hasOwnProperty(property)) {                            continue;                        }                                                if (instance[property] === undefined) {                                                        if (typeof mixinCompound.instance[property] == "function") {                                                                instance[property] = core.proxyFunction(                                    core.insider,                                     mixinCompound.instance[property]                                );                                                                } else {                                                                instance[property] = mixinCompound.instance[property];                                                            }                        }                                            }                                    }                            };                        core.addInsiderMember = function(key, value) {                if (typeof core.insider[key] !== "undefined") {                    throw new Error(                        "The internal member "                         + core.domainName                        + "." + core.className                         + "." + key                         + " cannot be redefined."                    );                }                                core.insider[key] = value;                            };                        core.proxyFunction = function(scope, originalFn) {                return function() {                    originalFn.apply(scope, arguments);                }            };            return core.init(coreOptions);        };        domain.Collection = function(collectionOptions) {            var collection = {                eventBus: null            };            collection.init = function(collectionOptions) {                collection.eventBus = collectionOptions.eventBus;                collection.itemFactoryMethod = collectionOptions.itemFactoryMethod;                collection.fireEventMethod = collectionOptions.fireEventMethod;                collection.findCoreMethod = collectionOptions.findCoreMethod;                                return {                    createItem: collection.createItem,                    readAllItems: collection.readAllItems,                    readItemUsingId: collection.readItemUsingId,                    updateItem: collection.updateItem,                    deleteItem: collection.deleteItem                };            };                        collection.itemFactoryMethod = function() {};                        collection.findCoreMethod = function() {};                        collection.fireEventMethod = function() {};                        collection.createItem = function(requiredValues) {                                if (typeof requiredValues == "undefined") {                    var requiredValues = {};                }                                var compound = collection.itemFactoryMethod(requiredValues);                return compound.instance;                            };            collection.readAllItems = function() {                var records = collection.fireEventMethod("readAllRecords", {}, []);                return collection.turnToItems(records);                            };                        collection.readItemUsingId = function(id) {            };            collection.updateItem = function(item) {                                var core = collection.findCoreMethod(item);                if (!core) {                    return;                }                                var idFieldName = core.getIdFieldName();                var record = core.getRecord();                                if (!record[idFieldName]) {                    collection.fireEventMethod("setRecordId", {                        idFieldName: idFieldName,                        record: record                    });                }                                collection.fireEventMethod("updateRecord", {                    idFieldName: idFieldName,                    record: record                });                            };            collection.deleteItem = function(item) {                var core = collection.findCoreMethod(item);                if (!core) {                    return;                }                                var idFieldName = core.getIdFieldName();                var record = core.getRecord();                                collection.fireEventMethod("deleteRecord", {                    idFieldName: idFieldName,                    idFieldValue: record[idFieldName]                });                                delete(item);                delete(core);            };                        collection.turnToItems = function(records) {                                var items = [];                                for (var i in records) {                    items.push(collection.turnToItem(records[i]));                }                                return items;                            };                        collection.turnToItem = function(record) {                var compound = collection.itemFactoryMethod(record);                                return compound.instance;                            };                        return collection.init(collectionOptions);        };        return domain.init(domainOptions);    };    application.EventBus = function(eventBusOptions) {            var eventBus = {            singletons: {},            handlers: {},            events: null        };        eventBus.init = function(eventBusOptions) {                        eventBus.makeInstanceMethod = eventBusOptions.makeInstanceMethod;            eventBus.events = eventBusOptions.events ? eventBusOptions.events : {};                        return {                fireEvent: eventBus.fireEvent            };                    };                eventBus.makeInstanceMethod = function(){};                eventBus.fireEvent = function(eventName, eventData, defaultResult) {            console.log(                'Domain '                + eventData.domainName                 + '.'                + eventData.itemClass                + ' fired "'                 + eventName                + '" event with this data:'            );            console.log(eventData);            if (eventBus.events[eventName]) {                                return eventBus.events[eventName](                    eventData,                     {                        addHandler: eventBus.addHandler,                        handle: function(data) {                            eventBus.handle(eventName, data);                        },                        makeInstance: eventBus.makeInstanceMethod,                        makeSingleton: eventBus.makeSingleton                    }                );                            } else {                                return defaultResult;                            }                    };                eventBus.addHandler = function(eventName, handler) {                        if (typeof eventBus.handlers[eventName] == "undefined") {                eventBus.handlers[eventName] = [];            }                        eventBus.handlers[eventName].push(handler);                    };                eventBus.handle = function(eventName, data) {                        var results = [];                        for (var i = 0; i < eventBus.handlers[eventName].length; i++) {                results.push(                    eventBus.handlers[eventName][i](data)                );            }                        return results;                    };                eventBus.makeSingleton = function(domainName, className) {                        if (!eventBus.singletons[domainName]) {                eventBus.singletons[domainName] = {};            }                        if (!eventBus.singletons[domainName][className]) {                eventBus.singletons[domainName][className] = eventBus.makeInstanceMethod(domainName, className);            }                        return eventBus.singletons[domainName][className];                    }                return eventBus.init(eventBusOptions);            }     application.Loader = function(loaderOptions) {                var loader = {};        loader.init = function(loaderOptions) {            return {                loadScript: loader.loadScript            };                    };                loader.getHttpRequest = function() {                        var xmlHttpFactories = [                function () {return new XMLHttpRequest()},                function () {return new ActiveXObject("Msxml2.XMLHTTP")},                function () {return new ActiveXObject("Msxml3.XMLHTTP")},                function () {return new ActiveXObject("Microsoft.XMLHTTP")}            ];            var httpRequest = false;                        for (var i=0; i<xmlHttpFactories.length; i++) {                try {                    httpRequest = xmlHttpFactories[i]();                }                catch (e) {                    continue;                }                break;            }                        if (httpRequest === false) {                throw new Error('This browser does not support XMLHttpRequest.');            }                        return httpRequest;        }        loader.loadScript = function(url, namespace){            var httpRequest = loader.getHttpRequest();            httpRequest.onreadystatechange = function() {                if ( httpRequest.readyState == 4 ) {                                        if (                             httpRequest.status == 200                         ||  httpRequest.status == 304                     ) {                                                  loader.includeJavaScript(                             namespace,                             httpRequest.responseText                         );                                            } else {                                                console.log(                             'XML request error: '                             + httpRequest.statusText                             + ' (' + httpRequest.status + ')'                         ) ;                    }                                    }            }                        httpRequest.open('GET', url, false);            httpRequest.send(null);                    };                loader.includeJavaScript = function(namespace, source) {            if (  source != null  ){                                eval("(" + source + ")(namespace);");                console.log(namespace);            }        }                return loader.init(loaderOptions);            }        return application.init(domains, events);}