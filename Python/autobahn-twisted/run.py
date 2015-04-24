import os
import sys

from autobahn.twisted.websocket import WebSocketServerProtocol, \
    WebSocketServerFactory, listenWS
from twisted.python import log
from twisted.internet import reactor, task

from ssl import SSLContextFactory

clients = {}


def client_count():
    print "Client Count: %s" % len(clients)


class MyServerProtocol(WebSocketServerProtocol):
    def onConnect(self, request):
        clients[self] = True

    def onMessage(self, payload, isBinary):
        self.sendMessage(payload, isBinary)

    def onClose(self, wasClean, code, reason):
        try:
            del clients[self]
        except:
            pass


if __name__ == '__main__':
    log.startLogging(sys.stdout)

    l = task.LoopingCall(client_count)
    l.start(1.0)

    if os.environ.get("USE_SSL"):
        factory = WebSocketServerFactory("wss://localhost:9000", debug=False)
        factory.protocol = MyServerProtocol
        ctx_factory = SSLContextFactory("../../keys/server.key",
                                        "../../keys/server.crt")
        listenWS(factory, ctx_factory)
    else:
        factory = WebSocketServerFactory("ws://localhost:9000", debug=False)
        factory.protocol = MyServerProtocol
        reactor.listenTCP(9000, factory)
    reactor.run()
