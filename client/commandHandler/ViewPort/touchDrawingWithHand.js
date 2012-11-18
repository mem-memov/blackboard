function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    
    lecturer.touchWithHand(command.getX(), command.getY());
    
}