function(Blackboard) {




Blackboard.Chalk = function(chalk) {

    return function(chalk) {
        
        return {};
    };
    
}

Blackboard.Tray = function(tray) {
    

    return function(tray) {
        
        return {};
    };
    
}


Blackboard.Lecturer = function(lecturer) {

    lecturer.face = function(thing, tool) {
        
        lecturer.facedThing = thing;
        lecturer.tool = tool;
        
    }
    
    lecturer.touchWithHand = function(x, y) {
        
        lecturer.isTouching = true;
        lecturer.facedThing.startChange(x, y, lecturer.tool);
        
    }
    
    lecturer.withdrawHand = function(x, y) {
        
        lecturer.isTouching = false;
        lecturer.facedThing.stopChange(x, y, lecturer.tool);
        
    }
    
    lecturer.moveHand = function(x, y, continueMethod) {

        if (lecturer.isTouching) {
            lecturer.facedThing.continueChange(x, y, lecturer.tool);
        }
        
    }
    
    lecturer.knockWithHand = function() {
        
    }
    
    return function(lecturer) {
        
        lecturer.defineField('facedThing');
        lecturer.defineField('tool');
        lecturer.defineField('isTouching');
console.log(lecturer.tool);
        return {
            face: lecturer.face,
            touchWithHand: lecturer.touchWithHand,
            withdrawHand: lecturer.withdrawHand,
            moveHand: lecturer.moveHand,
            knockWithHand: lecturer.knockWithHand
        };
        
    };
    
}

Blackboard.Board = function(board) {

    board.startChange = function(x, y, tool) {
     
        board.currentPath = board.pathCollection.createItem({});

        board.currentPath.addDot(x, y);
        
    };
    
    board.continueChange = function(x, y, tool) {

        board.currentPath.addDot(x, y);
        
    };
    
    board.stopChange = function(x, y, tool) {
        
        
        
    };
    
    return function(board) {
        
        board.defineField("currentPath");
        board.defineCollection("pathCollection", "Path");

        return {
            startChange: board.startChange,
            continueChange: board.continueChange,
            stopChange: board.stopChange
        };
        
    };
    
}

Blackboard.Path = function(path) {

    path.addDot = function(x, y) {
        
        path.dots.push({
            x: x,
            y: y
        });
        
        for (var i = 0; i < path.onDotHandlers.length; i++) {
            path.onDotHandlers[i](x, y);
        }
        
    };

    return function(path) {
        
        path.defineField("dots", []);
        path.defineEvents(
            "blackboardPathHasBeenCreated"
        );

        path.onDotHandlers = [];

        path.blackboardPathHasBeenCreated({
            addOnDotHandler: function(handler) {
                path.onDotHandlers.push(handler);
            }
        });

        return {
            addDot: path.addDot
        }
        
    };

    
}





}