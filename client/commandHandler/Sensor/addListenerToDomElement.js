function(manager, command) {
  
    var $ = manager.makeSingleton("Library", "JQuery").$;

    var $domElement = $("#" + command.getId());

    if (!$domElement) {
        console.error("DOM element not found");
    }

    switch (command.getEvent()) {
        case "mouseMove":
            $domElement.mousemove(function(e) { 
                command.getListener()(e.clientX, e.clientY);
            });
            break;
        case "mouseDown":
           $domElement.mousedown(function(e) { 
                command.getListener()(e.clientX, e.clientY);
            });
            break;
        case "mouseUp":
            $domElement.mouseup(function(e) { 
                command.getListener()(e.clientX, e.clientY);
            });
            break;
        case "doubleClick":
            $domElement.dblclick(function(e) { 
                command.getListener()(e.clientX, e.clientY);
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