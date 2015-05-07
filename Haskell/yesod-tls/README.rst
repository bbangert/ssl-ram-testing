Haskell Websocket Server
========================

Simple echo-based websocket server in Haskell using Yesod with its adapter to
``http://jaspervdj.be/websockets/``.

Compiling
---------

Create a cabal sandbox, get the Stackage config used, compile, and install:

.. code-block:: bash

    $ cabal sandbox init
    $ curl -O https://www.stackage.org/snapshot/nightly-2015-05-06/cabal.config
    $ mv cabal.config .cabal-sandbox/
    $ cabal update
    $ cabal install
