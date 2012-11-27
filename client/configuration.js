({
    Application: {
        Factory: {
            pathToDomains: "/client/domain"
        },
        Application: {
            pathToCommandHandlers: "/client/commandHandler",
            pathToEventHandlers: "/client/eventHandler",
            mustShowEventsInConsole: true
        }
    }
})