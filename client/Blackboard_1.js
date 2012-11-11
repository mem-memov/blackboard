function domain (Blackboard) {


Blackboard.Lecturer = function(lecturer) {

    lecturer.face = function(thing, tool) {

        lecturer.facedThing = thing;
        
        lecturer.tool = tool;
        
        lecturer.chooseAction();
        
    }
    
    lecturer.touchWithHand = function(x, y) {
        
        lecturer.isTouching = true;
        lecturer.action.start(x, y);
        
    }
    
    lecturer.withdrawHand = function(x, y) {
        
        lecturer.isTouching = false;
        lecturer.action.stop(x, y);
        
    }
    
    lecturer.moveHand = function(x, y, continueMethod) {

        if (lecturer.isTouching) {
            lecturer.action.run(x, y);
        }
        
    }
    
    lecturer.knockWithHand = function() {
        
    }
    
    lecturer.chooseAction = function() {

        if (
            lecturer.facedThing.__instanceOf("Board")
            && lecturer.tool.__instanceOf("Chalk")
        ) {
            lecturer.action = lecturer.lecturerDrawsWithChalkOnBoard({
                board: lecturer.facedThing,
                chalk: lecturer.tool
            });
        }
        
        if (
            lecturer.facedThing.__instanceOf("Board")
            && lecturer.tool.__instanceOf("Board")
        ) {
            lecturer.action = lecturer.lecturerMovesBoard({
                board: lecturer.facedThing
            });
        }
        
    }
    
    return function(lecturer) {
        
        lecturer.defineField("facedThing");
        lecturer.defineField("tool");
        lecturer.defineField("isTouching");
        lecturer.defineField("action");
        lecturer.defineMessage("lecturerDrawsWithChalkOnBoard", "LecturerDrawsWithChalkOnBoard");
        lecturer.defineMessage("lecturerMovesBoard", "LecturerMovesBoard");

        return {
            face: lecturer.face,
            touchWithHand: lecturer.touchWithHand,
            withdrawHand: lecturer.withdrawHand,
            moveHand: lecturer.moveHand,
            knockWithHand: lecturer.knockWithHand
        };
        
    };
    
}

Blackboard.LecturerDrawsWithChalkOnBoard = function(lecturerDrawsWithChalkOnBoard) {
    
    lecturerDrawsWithChalkOnBoard.defineParent("Action");
    
    lecturerDrawsWithChalkOnBoard.start = function(x, y) {
        
        console.log("Lecturer prepares for drawing with chalk on the board.");
        
        lecturerDrawsWithChalkOnBoard.board.showPath(
            lecturerDrawsWithChalkOnBoard.chalk.draw(x, y)
        );
        
    }

    lecturerDrawsWithChalkOnBoard.run = function(x, y) {
        
        console.log("Lecturer draws with chalk on the board.");
        
        lecturerDrawsWithChalkOnBoard.board.showPath(
            lecturerDrawsWithChalkOnBoard.chalk.draw(x, y)
        );
        
        
    }
    
    lecturerDrawsWithChalkOnBoard.stop = function(x, y) {
        
        console.log("Lecturer stops drawing with chalk on the board.");
        
        lecturerDrawsWithChalkOnBoard.chalk.move(x, y);

    }
    
    return function(lecturerDrawsWithChalkOnBoard) {
        
        lecturerDrawsWithChalkOnBoard.defineRequiredField("chalk");
        lecturerDrawsWithChalkOnBoard.defineRequiredField("board");

        return {
            start: lecturerDrawsWithChalkOnBoard.start,
            run: lecturerDrawsWithChalkOnBoard.run,
            stop: lecturerDrawsWithChalkOnBoard.stop
        };
    };
    
}

Blackboard.LecturerMovesBoard = function(lecturerMovesBoard) {
    
    lecturerMovesBoard.defineParent("Action");
    
    lecturerMovesBoard.start = function(x, y) {
        
        console.log("Lecturer prepares for moving the board.");
        
    }
    
    lecturerMovesBoard.run = function(x, y) {
        
        console.log("Lecturer moves the board.");
        
        lecturerMovesBoard.board.move(x, y);
        
    }
    
    lecturerMovesBoard.stop = function(x, y) {
        
        console.log("Lecturer stops moving the board.");
        
    }
    
    return function(lecturerMovesBoard) {
        
        lecturerMovesBoard.defineField("board");
        
        return {
            start: lecturerMovesBoard.start,
            run: lecturerMovesBoard.run,
            stop: lecturerMovesBoard.stop
        };
        
    }
    
}

Blackboard.Action = function(action) {
    
    action.start = function() {
        console.log("Action starts.");
    }

    action.run = function() {
        console.log("Action runs.");
    }

    action.stop = function() {
        console.log("Action stops.");
    }

    return function(tool) {

        return {
            start: action.start,
            run: action.run,
            stop: action.stop
        };
    };
    
}

Blackboard.Chalk = function(chalk) {

    chalk.draw = function(x, y) {
        
        if (!chalk.path) {
            chalk.path = chalk.pathCollection.createItem({});
        }
        
        chalk.path.addDot(x, y);
        
        return chalk.path;
        
    }
    
    chalk.move = function(x, y) {
        
        if (chalk.path) {
            chalk.path = null;
        }
        
    }

    return function(chalk) {

        chalk.defineField("path", null);
        chalk.defineCollection("pathCollection", "Path");

        return {
            draw: chalk.draw,
            move: chalk.move
        };
    };
    
}

Blackboard.Board = function(board) {

    board.showPath = function(path) {
     
        board.pathCollection.updateItem(path);
        
    };
    
    board.move = function(x, y) {
        
        
        
    }

    
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