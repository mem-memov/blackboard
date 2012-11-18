function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    
    lecturer.withdrawHand(command.getX(), command.getY());
    
}