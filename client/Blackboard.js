function domain (Blackboard) {



Blackboard.Tool = function(tool) {
    
    tool.start = function() {
        console.log("Tool starts.");
    }

    tool.work = function() {
        console.log("Tool works.");
    }

    tool.stop = function() {
        console.log("Tool stops.");
    }

    return function(tool) {

        return {
            start: tool.start,
            work: tool.work,
            stop: tool.stop
        };
    };
    
}


Blackboard.Chalk = function(chalk) {

    chalk.defineParent("Tool");
    
    chalk.start = function(thing, x, y) {
        
        console.log("Chalk starts.");

        chalk.thing = thing;
        
        chalk.path = chalk.pathCollection.createItem({});

        chalk.path.addDot(x, y);
        
        chalk.thing.showPath(chalk.path);
        
    }

    chalk.work = function(x, y) {
        
        console.log("Chalk works.");
        
        chalk.path.addDot(x, y);
        
    }
    
    chalk.stop = function() {
        
        console.log("Chalk stops.");

    }

    return function(chalk) {
        
        chalk.defineField("path");
        chalk.defineField("thing");
        chalk.defineCollection("pathCollection", "Path");
        
        chalk.defineMessages(
            "ChalkDrawsLines"
        );
        
        return {
            start: chalk.start,
            work: chalk.work,
            stop: chalk.stop
        };
    };
    
}

Blackboard.ChalkDrawsLines = function(chalk) {
    
    
    
}

Blackboard.Tray = function(tray) {
    

    return function(tray) {
        
        return {};
    };
    
}


Blackboard.Lecturer = function(lecturer) {

    lecturer.face = function(thing, tool) {
        
        if (!tool.__instanceOf("Tool")) {
            throw new Error("Lecturer needs a tool.");
        }
        
        lecturer.facedThing = thing;
        
        lecturer.tool = tool;
        
    }
    
    lecturer.touchWithHand = function(x, y) {
        
        lecturer.isTouching = true;
        lecturer.tool.start(lecturer.facedThing, x, y);
        
    }
    
    lecturer.withdrawHand = function(x, y) {
        
        lecturer.isTouching = false;
        lecturer.tool.stop(x, y);
        
    }
    
    lecturer.moveHand = function(x, y, continueMethod) {

        if (lecturer.isTouching) {
            lecturer.tool.work(x, y);
        }
        
    }
    
    lecturer.knockWithHand = function() {
        
    }
    
    return function(lecturer) {
        
        lecturer.defineField('facedThing');
        lecturer.defineField('tool');
        lecturer.defineField('isTouching');
//console.log(lecturer.tool);
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

    board.showPath = function(path) {
     
        board.pathCollection.updateItem(path);
        
    };

    
    return function(board) {
        
        board.defineIdField("boardId");
        board.defineField("currentPath");
        board.defineCollection("pathCollection", "Path");

        return {
            showPath: board.showPath
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