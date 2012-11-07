var dddCompact = new DddCompact({
    Blackboard: '/client/Blackboard.js',
    ViewPort: '/client/ViewPort.js',
    Library: '/client/Library.js',
    Persistence: '/client/Persistence.js'
}, {
    setRecordId: function(data, eventBus) {
        var persistence = eventBus.makeSingleton("Persistence", "Persistence");
        return persistence.setRecordId(data.domainName, data.itemClass, data.idFieldName, data.record);
    },
    readAllRecords: function(data, eventBus) {
        var persistence = eventBus.makeSingleton("Persistence", "Persistence");
        return persistence.readAllRecords(data.domainName, data.itemClass);
    },
    updateRecord: function(data, eventBus) {
        var persistence = eventBus.makeSingleton("Persistence", "Persistence");
        return persistence.updateRecord(data.domainName, data.itemClass, data.idFieldName, data.record);
    },
    deleteRecord: function(data, eventBus) {
        var persistence = eventBus.makeSingleton("Persistence", "Persistence");
        return persistence.deleteRecord(data.domainName, data.itemClass, data.idFieldName, data.idFieldValue);
    },
    setDomElementStyle: function(data, eventBus) {
        var $ = eventBus.makeSingleton("Library", "JQuery");
        $(data.domElement).css(data.style);
        
    },
    bindEventHandlerToDomElement: function(data, eventBus) {
        
        var $ = eventBus.makeSingleton("Library", "JQuery");
        switch (data.event) {
            case "onmousemove":
                $(data.domElement).unbind('mousemove');
                $(data.domElement).mousemove(function(e) { 
                    data.handler(e.clientX, e.clientY);
                });
                break;
            case "onclick":
                $(data.domElement).unbind('click');
                $(data.domElement).click(function(e) { 
                    data.handler(e.clientX, e.clientY);
                });
                break;
            case "onmousedown":
                $(data.domElement).unbind('mousedown');
                $(data.domElement).mousedown(function(e) { 
                    data.handler(e.clientX, e.clientY);
                });
                break;
            case "onmouseup":
                $(data.domElement).unbind('mouseup');
                $(data.domElement).mouseup(function(e) { 
                    data.handler(e.clientX, e.clientY);
                });
                break;
            case "ondblclick":
                $(data.domElement).unbind('ondblclick');
                $(data.domElement).dblclick(function(e) { 
                    data.handler(e.clientX, e.clientY);
                });
                break;
 
        }
    },
    createSvgElement: function(data, eventBus) {
        
        //Defining the SVG Namespace
        var svgNS = "http://www.w3.org/2000/svg";
        //Creating a Document by Namespace
        var element = document.createElementNS(svgNS, data.type);
        
        var utilities = eventBus.makeSingleton("Library", "Utilities");
        
        if (!utilities.test.isEmpty(data.attributes)) {
            utilities.object.each(data.attributes, function(key, value) {
                element.setAttribute(key, value);
            });
        }
       
        if (!utilities.test.isEmpty(data.container)) {
            data.container.appendChild(element);
        }

        return element;
        
    },
    
    
    
    
    viewPortDrawingHasBeenCreated: function(data, eventBus) {
        
        var 
            lecturer = eventBus.makeSingleton("Blackboard", "Lecturer"),
            blackboard = eventBus.makeSingleton("Blackboard", "Board")
        ;

        lecturer.face(blackboard);
        
        eventBus.addHandler("blackboardPathHasBeenCreated", data.createCurve);
       
        data.addDownHandler(lecturer.touchWithHand);
        data.addUpHandler(lecturer.withdrawHand);
        data.addMoveHandler(lecturer.moveHand);
        data.addKnockHandler(lecturer.knockWithHand);

    },
    
    blackboardPathHasBeenCreated: function(data, eventBus) {
        
        eventBus.handle({
            addOnDotHandler: data.addOnDotHandler
        });
        
    },
    
    blackboardPathHasBeenAugmented: function(data, eventBus) {
        
        eventBus.handle({
            dots: data.dots
        });
        
    }
    
    
}, true);