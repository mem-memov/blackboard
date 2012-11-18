function(manager, command) {
    
     var drawing = manager.makeSingleton(
        "ViewPort", 
        "Drawing", 
        {
            id: 'panel'
        }
    );
        
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    var board = manager.makeSingleton("Blackboard", "Board");
    var chalk = manager.makeSingleton("Blackboard", "Chalk");
    
    lecturer.face(board, chalk);

}