function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    lecturer.knockWithHand(command.getX(), command.getY());
    
}