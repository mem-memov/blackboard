function(manager, command) {
    
    var facade = manager.makeSingleton("Blackboard", "Facade");

    var lecturer = facade.makeLecturer({id: 1});
    
    lecturer.withdrawHand(command.getX(), command.getY());
    
}