function(manager, command, onDone, onError) {

    manager.makeSingleton(
        "Library", 
        "JQuery",
        {},
        function(jQuery) {
         
            var $ = jQuery.$;
      
            var $domElement = $("#" + command.getId());

            if ($domElement) {
                $domElement.css(command.getStyle());
                onDone();
            } else {
                if (typeof onError === "function") {
                    onError();
                }
            }
            
            
        }
    );
   

    
}