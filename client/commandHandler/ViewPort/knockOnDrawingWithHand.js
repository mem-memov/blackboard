function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    lecturer.knockWithHand(command.get("x"), command.get("y"));
    
}