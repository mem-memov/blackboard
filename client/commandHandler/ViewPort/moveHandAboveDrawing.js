function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    
    lecturer.moveHand(command.getX(), command.getY());
    
}