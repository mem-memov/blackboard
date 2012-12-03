function(manager, command) {
    
    var sensorPanel = manager.makeSingleton(
        "Sensor", 
        "Panel", 
        {
            id: 'panel'
        }
    );
        
    var drawing = manager.makeSingleton(
        "ViewPort", 
        "Drawing", 
        {
            id: 'panel'
        }
    );
        
    var facade = manager.makeSingleton("Blackboard", "Facade");

    var lecturer = facade.makeLecturer({id: 1});
    var board = facade.makeBoard();
    var chalk = facade.makeChalk();
    
    lecturer.face(board, chalk);

}