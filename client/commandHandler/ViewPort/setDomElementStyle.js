function(manager, command) {

    var $ = manager.makeSingleton("Library", "JQuery").$;

    var $domElement = $("#" + command.get("id"));
    
    if (!$domElement) {
        console.error("DOM element not found");
    }
    
    $domElement.css(command.get("style"));

}