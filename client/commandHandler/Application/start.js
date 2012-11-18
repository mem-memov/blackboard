function(manager, command, onDone, onError) {
    
    manager.makeSingleton(
        "ViewPort", 
        "Drawing", 
        {
            id: 'panel'
        },
        function(drawing) {
            
            manager.makeSingleton(
                "Blackboard", 
                "Lecturer",
                {},
                function(lecturer) {

                    manager.makeSingleton(
                        "Blackboard", 
                        "Board",
                        {},
                        function(board) {
                            
                            manager.makeSingleton(
                                "Blackboard", 
                                "Chalk",
                                {},
                                function(chalk) {

                                    lecturer.face(board, chalk)

                                }
                            );

                        }
                    );

                }
            );
            
            
        }
    );

}