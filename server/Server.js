var Server = function(options) {
    
    var server = {
        http: null
    };
    
    server.init = function(options) {
        
        server.http = options.http;
        
        return {
            start: server.start
        }
    }
    
    server.start = function() {

        server.http.createServer(function(request, response) {
            console.log("Request received.");
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write("Hello World");
            response.end();
        }).listen("8080", "127.0.0.1");
        
        console.log("Server has started.");

        
    }
    
    return server.init(options);
    
}

exports.Server = Server;