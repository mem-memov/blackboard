function(Blackboard) {




Blackboard.Chalk = function(core) {
    
    var chalk = this;

    chalk.init = function(core) {
        
        core.isIn(chalk);
        
        return {
            
        };

    }
    
    return chalk.init(core);
    
}

Blackboard.Tray = function(core) {
    
    var tray = this;

    tray.init = function(core) {
        
        core.isIn(tray);
        
        return {
            
        };

    }
    
    return tray.init(core);
    
}


Blackboard.Lecturer = function(core) {
    
    var lecturer = this;

    lecturer.init = function(core) {
        
        core.isIn(lecturer);
        core.defineField('facedThing');
        core.defineField('tool');
        core.defineField('isTouching');
        
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
    
    return lecturer.init(core);
    
}

Blackboard.Board = function(core) {

    var board = this;
    
    board.init = function(core) {
        
        core.isIn(board);

        core.defineField('currentPath');
        core.defineCollection('pathCollection', 'Path');
        core.defineEvents(
            "blackboardPathHasBeenCreated"
        );

     
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
    
    return board.init(core);
    
}

Blackboard.Path = function(core) {
    
    var path = this;
    
    path.init = function(core) {
        
        core.isIn(path);
        core.defineField('dots', []);
        core.defineEvents(
            'blackboardPathHasBeenCreated'
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

    return path.init(core);
    
}

Blackboard.Changable = function(core) {

    var changable = this;
    
    changable.init = function(core) {
        core.isIn(changable);
        core.isInterface();
        
        return {
            
        };
    }
    
    changable.startChange = function(x, y, tool) {}
    
    return changable.init(core);
    
}




}