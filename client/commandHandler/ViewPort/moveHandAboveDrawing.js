function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    
    lecturer.moveHand(command.get("x"), command.get("y"));
    
}