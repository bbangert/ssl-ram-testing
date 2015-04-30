#!py27/bin/python
import os
import sys

from autobahn.twisted.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory, listenWS
from twisted.python import log
from twisted.internet import reactor

from ssl_settings import SSLContextFactory

clients = {}
PORT = os.environ.get("SERVER_PORT", "9000")


class MyServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        self.transport.bufferSize = 2 * 1024
        clients[self] = True

    def onMessage(self, payload, isBinary):
        self.sendMessage(payload, isBinary)

    def onClose(self, wasClean, code, reason):
        clients.pop(self, None)


if __name__ == '__main__':
    log.startLogging(sys.stdout)

    if os.environ.get("USE_SSL"):
        factory = WebSocketServerFactory("wss://localhost:%s" % PORT,
                                         debug=False)
        factory.protocol = MyServerProtocol
        ctx_factory = SSLContextFactory("../../keys/server.key",
                                        "../../keys/server.crt")
        listenWS(factory, ctx_factory)
    else:
        factory = WebSocketServerFactory("ws://localhost:%s" % PORT,
                                         debug=False)
        factory.protocol = MyServerProtocol
        reactor.listenTCP(9000, factory)
    reactor.run()
