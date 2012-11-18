function(manager, command, onDone, onError) {

    manager.makeSingleton(
        "Library", 
        "JQuery",
        {},
        function(jQuery) {
            
            var $ = jQuery.$;

            var $domElement = $("#" + command.getId());

            if ($domElement) {

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

                onDone();

            } else {

                if (typeof onError === "function") {
                    onError("DOM element not found");
                } else {
                    console.error("DOM element not found");
                }

            }
            
            
        }
    );
   

    
}