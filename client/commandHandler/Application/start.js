function(manager, command) {
    
    var sensorPanel = manager.makeSingleton(
        "Sensor", 
        "Panel", 
        {
            id: 'panel'
        }
    );
        
    var viewPortFacade = manager.makeSingleton("ViewPort", "Facade");
    var drawing = viewPortFacade.makeDrawing('panel');
        
    var blackboardFacade = manager.makeSingleton("Blackboard", "Facade");

    var lecturer = blackboardFacade.makeLecturer({id: 1});
    var board = blackboardFacade.makeBoard();
    var chalk = blackboardFacade.makeChalk();
    var tray = blackboardFacade.makeTray();
    
    lecturer.face(board, chalk);

}