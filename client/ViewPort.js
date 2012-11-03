function(ViewPort) {
    
    
ViewPort.Layer = function(core) {
    
    var layer = this;
    
    layer.init = function(core) {
        
        core.isIn(layer);
        
        
        return {
            
        }
    }
    
    return layer.init(core);
    
}
    
ViewPort.Curve = function(core) {
    
    var curve = this;
    
    curve.init = function(core) {
        
        core.isIn(curve);
        core.defineRequiredField("container");
        core.defineField("element");
        
        core.defineEvents(
            "createSvgElement"
        );

        return {
            draw: curve.draw
        }
        
    }
    
    curve.draw = function(x, y) {
     
        if (!curve.element) {
            
            curve.element = curve.createSvgElement({
                type: "path",
                attributes: {
                    "d": "M" + x + " " + y,
                    "stroke": "white",
                    "stroke-width": 1,
                    "fill": "none",
                    "result": null
                },
                container: curve.container
            });
            
        } else {
            
            var d = curve.element.getAttribute("d") + " L" + x + " " + y;
            curve.element.setAttribute("d", d);
            
        }

    }
    
    return curve.init(core);
    
}
    
    
ViewPort.Drawing = function(core) {
    
    var drawing = this;

    drawing.init = function(core) {
        
        core.isIn(drawing);
        core.defineCollection('curveCollection', 'Curve');
        core.defineRequiredField("id");
        core.defineField("color", "#003300");
        core.defineField("model")
        
        core.defineEvents(
            "viewPortDrawingHasBeenCreated",
            "bindEventHandlerToDomElement", 
            "createSvgElement",
            "setDomElementStyle"
        );
            
        drawing.element = null;
        drawing.currentCurve = null;

        drawing.setElement({
            id: drawing.id,
            color: drawing.color
        });
        
        var handlers = {
            down: [],
            up: [],
            move: [],
            knock: []
        }
        
        drawing.viewPortDrawingHasBeenCreated({
            createCurve: drawing.createCurve,
            addDownHandler: function(handler) {
                handlers.down.push(handler);
            },
            addUpHandler: function(handler) {
                handlers.up.push(handler);
            },
            addMoveHandler: function(handler) {
                handlers.move.push(handler);
            },
            addKnockHandler: function(handler) {
                handlers.knock.push(handler);
            },
            setModel: function(model) {
                drawing.model = model;
            }
        });
        
        
        
        drawing.bindHandlersToEvents(handlers);

        return null;

    }
    
    drawing.setElement = function(options) {
        
        drawing.element = document.getElementById(options.id); // TODO: to be incapsulated
        
        drawing.setDomElementStyle({
            domElement: drawing.element,
            style: {
                "background-color": options.color
            }
        });
        
    }
    
    drawing.bindHandlersToEvents = function(handlers) {

        drawing.bindEventHandlerToDomElement({
            domElement: drawing.element,
            event: "onmousedown",
            handler: function() {
                for (var i = 0; i < handlers.down.length; i++) {
                    handlers.down[i].apply(this, arguments);
                }
            }
        });

        drawing.bindEventHandlerToDomElement({
            domElement: drawing.element,
            event: "onmouseup",
            handler: function() {
                for (var i = 0; i < handlers.up.length; i++) {
                    handlers.up[i].apply(this, arguments);
                }
            }
        });

        drawing.bindEventHandlerToDomElement({
            domElement: drawing.element,
            event: "onmousemove",
            handler: function() { 
                for (var i = 0; i < handlers.move.length; i++) {
                    handlers.move[i].apply(this, arguments);
                }
            }
        });

        drawing.bindEventHandlerToDomElement({
            domElement: drawing.element,
            event: "ondblclick",
            handler: function() {
                for (var i = 0; i < handlers.knock.length; i++) {
                    handlers.knock[i].apply(this, arguments);
                }
            }
        });

    }
    
    drawing.createCurve = function(options) {
        
        var curve = drawing.curveCollection.createItem({
            container: drawing.element
        });
        
        options.addOnDotHandler(curve.draw);
        
    }
 
    return drawing.init(core);
    
}
    
    
    
    
    
}

