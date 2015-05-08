websocket-driver provides the protocol layer for faye-websocket, which was
extracted from the Faye project. The driver implements hixie-{75-76},
hybi-{07-13}, and RFC 6455, and passes the Autobahn test suite.

SockJS uses faye-websocket for its WebSocket transport. This test server
uses websocket-driver directly.

Please see `../README.txt` for setup and usage instructions.
