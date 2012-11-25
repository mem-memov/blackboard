function(manager, command) {
    
    var $ = manager.makeSingleton("Library", "JQuery").$;

    var $domElement = $("#" + command.get("id"));

    if (!$domElement) {
        console.error("DOM element not found");
    }

    switch (command.get("event")) {
        case "mouseMove":
            $domElement.mousemove(function(e) { 
                command.get("listener")(e.clientX, e.clientY);
            });
            break;
        case "mouseDown":
           $domElement.mousedown(function(e) { 
                command.get("listener")(e.clientX, e.clientY);
            });
            break;
        case "mouseUp":
            $domElement.mouseup(function(e) { 
                command.get("listener")(e.clientX, e.clientY);
            });
            break;
        case "doubleClick":
            $domElement.dblclick(function(e) { 
                command.get("listener")(e.clientX, e.clientY);
            });
            break;
        default:
            if (typeof onError === "function") {
                onError("Unknown event name");
            } else {
                console.error("Unknown event name");
            }
            break;
    }

}