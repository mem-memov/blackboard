meta["class"] = "LecturerFactory";
meta["category"] = "factory";
meta["public"] = ["make"];

o.init = function(options) {
    
}

o.make = function(lecturerOptions) {
    
    if (typeof lecturerOptions === "undefined") {
        lecturerOptions = {};
    }
    
    return app.make("Lecturer", lecturerOptions);
    
}