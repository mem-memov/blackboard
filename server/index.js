var Server = require("./Server").Server;
var server = new Server({
    http: require("http")
});
server.start();

