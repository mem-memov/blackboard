function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    
    lecturer.touchWithHand(command.get("x"), command.get("y"));
    
}