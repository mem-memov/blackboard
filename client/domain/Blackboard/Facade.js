meta["class"] = "Facade";
meta["category"] = "facade";
meta["public"] = ["makeLecturer", "makeChalk", "makeBoard", "makeTray"];

o.init = function(options, configuration) {
    
    o.unique = {};
    
}

o.unique;

o.makeLecturer = function(lecturerOptions) {
    if (!lecturerOptions.id) {
        console.error("You must provide an id when creating a lecturer object.");
    }
    return o.makeLecturerRepository().fetchItem(lecturerOptions.id);
}

o.makeLecturerRepository = function() {
    return o.makeUniqueInstance("LecturerRepository", {
        make: o.makeLecturerFactory().make
    });
}

o.makeLecturerFactory = function() {
    return o.makeUniqueInstance("LecturerFactory");
}

o.makeChalk = function() {
    return app.make("Chalk", {
        fetchPath: o.makePathRepository().fetchItem
    });
}

o.makePathRepository = function() {
    return o.makeUniqueInstance("PathRepository", {
        make: o.makePathFactory().make
    });
}

o.makePathFactory = function() {
    return o.makeUniqueInstance("PathFactory");
}

o.makeBoard = function() {
    return app.make("Board");
}

o.makeTray = function() {
    return app.make("Tray");
}

o.makeUniqueInstance = function(className, instanceOptions) {
    
    if (typeof o.unique[className] === "undefined") {
        
        o.unique[className] = app.make(className, instanceOptions);
        
    }
    
    return o.unique[className];
    
}

o.buildIdGeneratorFunction = function() {
    
    //return function
}