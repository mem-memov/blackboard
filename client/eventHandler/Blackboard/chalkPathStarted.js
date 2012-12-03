function(manager, event) {
    
    var viewPortFacade = manager.makeSingleton("ViewPort", "Facade");
    var drawing = viewPortFacade.makeDrawing('panel');
    
    drawing.addCurve(event.getX(), event.getY());
    
}