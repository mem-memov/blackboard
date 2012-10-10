var Server = require("./server/Server");
var server = new Server({
    http: require("http")
});
server.start();

