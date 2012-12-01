function(manager, command) {
   
    var facade = manager.makeSingleton("Blackboard", "Facade");

    var lecturer = facade.makeLecturer({id: 1});
    
    lecturer.moveHand(command.getX(), command.getY());
    
}