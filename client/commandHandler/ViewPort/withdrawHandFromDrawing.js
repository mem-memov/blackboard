function(manager, command) {
    
    var lecturer = manager.makeSingleton("Blackboard", "Lecturer");
    
    lecturer.withdrawHand(command.get("x"), command.get("y"));
    
}