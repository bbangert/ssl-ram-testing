# Simple C Websocket Server

A basic hacked together C websocket server. This unfortunately is hardcoded to
use port 9000 and always use SSL as I don't know C and cobbled this together
from examples.

It compiles on my system if I go into the websocket_chat directory and type
``make``. You will then need to alias the resulting binary to be in this
directory by the name of ``run`` for the tester to use it mostly correctly.
