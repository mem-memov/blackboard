meta["class"] = "Tray";
meta["public"] = ["giveTool"];

o.init = function(options, configuration) {
    
    o.tools = options.tools;

}

o.tools;

o.takeTool = function(tool) {
    
}

o.giveTool = function(toolName) {
    
    return o.tools[toolName];
    
}

