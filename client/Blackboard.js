function(Blackboard) {




Blackboard.Chalk = function(chalk) {
    
    chalk.init = function() {
        
        return {};
    }

    
    return chalk.init();
    
}

Blackboard.Tray = function(tray) {
    
    tray.init = function() {
        
        return {};
    }

    
    return tray.init();
    
}


Blackboard.Lecturer = function(lecturer) {
    
    lecturer.init = function() {
        
        lecturer.defineField('facedThing');
        lecturer.defineField('tool');
        lecturer.defineField('isTouching');

        return {
            face: lecturer.face,
            touchWithHand: lecturer.touchWithHand,
            withdrawHand: lecturer.withdrawHand,
            moveHand: lecturer.moveHand,
            knockWithHand: lecturer.knockWithHand
        };
        
    }

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
    
    return lecturer.init();
    
}

Blackboard.Board = function(board) {
    
    board.init = function() {
        
        board.defineField("currentPath");
        board.defineCollection("pathCollection", "Path");

        return {
            startChange: board.startChange,
            continueChange: board.continueChange,
            stopChange: board.stopChange
        };
        
    };

    board.startChange = function(x, y, tool) {
     
        board.currentPath = board.pathCollection.createItem({});

        board.currentPath.addDot(x, y);
        
    };
    
    board.continueChange = function(x, y, tool) {

        board.currentPath.addDot(x, y);
        
    };
    
    board.stopChange = function(x, y, tool) {
        
        
        
    };
    
    return board.init();
    
}

Blackboard.Path = function(path) {
    
    path.init = function() {
        
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
    
    path.addDot = function(x, y) {
        
        path.dots.push({
            x: x,
            y: y
        });
        
        for (var i = 0; i < path.onDotHandlers.length; i++) {
            path.onDotHandlers[i](x, y);
        }
        
    };

    return path.init();

    
}





}