Go Websocket Server
===================

Simple echo-based websocket server in Go using
``https://github.com/gorilla/websocket``.

Compiling
---------

To setup a GOPATH, fetch the required lib, and build:

.. code-block:: bash

    $ mkdir gocode
    $ export GOPATH=`pwd`/gocode
    $ go get github.com/gorilla/websocket
    $ go build -o run main.go
