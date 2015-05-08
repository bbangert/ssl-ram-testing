var fs = require('fs');
var http = require('http');
var https = require('https');

exports.upgradeRequired = function upgradeRequired(req, res) {
    res.writeHead(426, {
        'content-type': 'text/plain',
        'connection': 'upgrade',
        'upgrade': 'websocket'
    });
    res.end('WebSocket protocol required');
};

exports.getPort = function getPort() {
    var port = +process.env.SERVER_PORT;
    return isFinite(port) ? port : 9000;
};

exports.createServer = function createServer(handler) {
    var server;
    if (process.env.USE_SSL) {
        return https.createServer({
            key: fs.readFileSync(__dirname + '/../keys/server.key'),
            cert: fs.readFileSync(__dirname + '/../keys/server.crt')
        }, handler);
    }
    return http.createServer(handler);
};
