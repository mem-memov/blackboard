function(manager, command, onDone, onError) {
    
    manager.makeSingleton(
        "Blackboard", 
        "Lecturer",
        {},
        function(lecturer) {
         
            lecturer.knockWithHand(command.getX(), command.getY());
            
        }
    );
    
}