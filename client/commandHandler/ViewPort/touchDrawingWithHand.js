function(manager, command, onDone, onError) {
    
    manager.makeSingleton(
        "Blackboard", 
        "Lecturer",
        {},
        function(lecturer) {

            lecturer.touchWithHand(command.getX(), command.getY());
            
        }
    );
    
}