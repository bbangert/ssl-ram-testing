var assert = require('assert');
var fs = require('fs');
var http = require('http');
var https = require('https');

var ws = require('ws');

function handler(req, res) {
    res.writeHead(426, {
        'content-type': 'text/plain',
        'connection': 'upgrade',
        'upgrade': 'websocket'
    });
    res.end('WebSocket protocol required');
}

function onClose() {
    this.removeListener('message', onMessage);
    this.removeListener('error', onError);
    this.removeListener('close', onClose);
}

function onError() {
    this.removeListener('error', onError);
    this.terminate();
}

function onMessage(data, flags) {
    this.send(data, flags);
}

function onConnection(socket) {
    socket.on('message', onMessage);
    socket.on('error', onError);
    socket.on('close', onClose);
}

module.exports = function main() {
    var port = +process.env.SERVER_PORT;
    if (!isFinite(port)) {
        port = 9000;
    }

    var server;
    if (process.env.USE_SSL) {
        server = https.createServer({
            key: fs.readFileSync(__dirname + '/../keys/server.key'),
            cert: fs.readFileSync(__dirname + '/../keys/server.crt'),
        }, handler);
    } else {
        server = http.createServer(handler);
    }

    var socketServer = new ws.Server({
        server: server,
        disableHixie: true
    });
    socketServer.on('connection', onConnection);

    server.listen(port, function afterListen(err) {
        assert.ifError(err);
        console.log('Listening on port %d...', port);
    });
};
