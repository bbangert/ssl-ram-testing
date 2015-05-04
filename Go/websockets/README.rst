Go Websocket Server
===================

Simple echo-based websocket server in Go using
``code.google.com/p/go.net/websocket``.

Compiling
---------

To setup a GOPATH, fetch the required lib, and build:

.. code-block:: bash

    $ mkdir gocode
    $ export GOPATH=`pwd`/gocode
    $ go get code.google.com/p/go.net/websocket
    $ go build -o run main.go
