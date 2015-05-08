var assert = require('assert');

var ws = require('ws');

var common = require('../common');

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
    var server = common.createServer(common.upgradeRequired);
    var socketServer = new ws.Server({
        server: server,
        disableHixie: true,
        protocolVersion: 13
    });
    socketServer.on('connection', onConnection);
    var port = common.getPort();
    server.listen(port, function afterListen(err) {
        assert.ifError(err);
        console.log('ws: Listening on port %d...', port);
    });
};
