function(manager, command, onDone, onError) {
    
    manager.makeSingleton(
        "Blackboard", 
        "Lecturer",
        {},
        function(lecturer) {
         
            lecturer.withdrawHand(command.getX(), command.getY());
            
        }
    );
    
}