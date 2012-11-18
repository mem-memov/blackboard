function(manager, command) {
  
    var $ = manager.makeSingleton("Library", "JQuery").$;

    var $domElement = $("#" + command.getId());
    
    if (!$domElement) {
        console.error("DOM element not found");
    }
    
    $domElement.css(command.getStyle());

}