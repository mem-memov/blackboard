var Server = require("./server/Server").Server;
var server = new Server({
    http: require("http")
});
server.start();

