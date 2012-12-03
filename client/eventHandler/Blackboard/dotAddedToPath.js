function(manager, event) {
    
    var viewPortFacade = manager.makeSingleton("ViewPort", "Facade");
    var drawing = viewPortFacade.makeDrawing('panel');
    
    drawing.draw(event.getX(), event.getY());
    
}