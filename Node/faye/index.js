var assert = require('assert');

var driver = require('websocket-driver');
var Server = require('websocket-driver/lib/websocket/driver/server');
var Hybi = require('websocket-driver/lib/websocket/driver/hybi');

var common = require('../common');

function onMessage(message) {
    this.write(message);
}

function onEnd(event) {
    this.removeListener('message', onMessage);
    this.removeListener('end', onEnd);
}

function onUpgrade(request, socket, body) {
    if (!driver.isWebSocket(request)) {
        socket.destroy();
        return;
    }
    var d = new Hybi(request, Server.determineUrl(request), {
        requireMasking: true
    });
    d.io.write(body);
    socket.pipe(d.io).pipe(socket);
    d.messages.on('data', onMessage);
    d.messages.on('end', onEnd);
    d.start();
}

module.exports = function main() {
    var server = common.createServer(common.upgradeRequired);
    server.on('upgrade', onUpgrade);
    var port = common.getPort();
    server.listen(port, function afterListen(err) {
        assert.ifError(err);
        console.log('faye: Listening on port %d...', port);
    });
};
