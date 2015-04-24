import os
import sys

from autobahn.twisted.websocket import WebSocketClientProtocol, \
    WebSocketClientFactory, connectWS

from twisted.python import log
from twisted.internet import reactor, ssl
from twisted.internet.defer import Deferred, inlineCallbacks


CLIENT_COUNT = int(os.environ.get("CLIENT_COUNT", "1000"))
PING_INTERVAL = int(os.environ.get("PING_INTERVAL", "30"))


def sleep(delay):
    d = Deferred()
    reactor.callLater(delay, d.callback, None)
    return d


class MyClientProtocol(WebSocketClientProtocol):
    def onOpen(self):
        self.sendMessage(u"ping!".encode('utf8'))

    @inlineCallbacks
    def onMessage(self, payload, isBinary):
        yield sleep(PING_INTERVAL)
        self.sendMessage(u"ping!".encode('utf8'))

if __name__ == '__main__':
    log.startLogging(sys.stdout)

    if os.environ.get("USE_SSL"):
        factory = WebSocketClientFactory("wss://localhost:9000", debug=False)
    else:
        factory = WebSocketClientFactory("ws://localhost:9000", debug=False)

    factory.protocol = MyClientProtocol

    if factory.isSecure:
        contextFactory = ssl.ClientContextFactory()
    else:
        contextFactory = None

    for i in xrange(CLIENT_COUNT):
        reactor.callLater(i/100.0, connectWS, factory, contextFactory)
    reactor.run()
