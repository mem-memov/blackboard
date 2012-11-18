function(manager, command, onDone, onError) {
    
    manager.makeSingleton(
        "Blackboard", 
        "Lecturer",
        {},
        function(lecturer) {
         
            lecturer.moveHand(command.getX(), command.getY());
            
        }
    );
    
}