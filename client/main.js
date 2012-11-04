//console.log = function(){};

window.onload=function() {
    
    var drawing = dddCompact.makeInstance("ViewPort", "Drawing", {
        id: 'panel'
    });

    drawing.publicTestMethod(9001);

};
