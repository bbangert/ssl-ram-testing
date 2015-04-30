########################
SSL RAM Overhead Testing
########################

This project is intended to make it relatively easy to run and compare
Websocket servers with a variety of languages/libraries/frameworks with and
without SSL encryption. The intent is to more clearly document the RAM overhead
per connection to determine minimum server requirements for handling large
amounts of connections, as well as see if some SSL handling is more efficient
RAM-wise than other languages/stacks.

Project Layout
==============

.. code-block:: txt

    LANGUAGE/
        STACK/
            README.txt
            run

It's not feasible to have a generic way to setup each stack, so each one to be
tested should include its own ``README.txt`` indicating how its environment
should be setup within its directory, and a ``run`` script/project that the
tester will run.

Run Program
===========

The ``run`` script/project in each directory will be called with the current
working directory set to its directory, it's output will be monitored and the
tester will connect clients after output is not emitted for several seconds.

It will be called for two runs, one with SSL, and one without. The program
should use SSL when the ``USE_SSL`` environment variable is set to ``true``.

Testing
=======

The tester is a Python script with a Python websocket test client. To setup the
tester a Python **2.7** virtualenv should be used, and ``tester/requirements.txt``
should be installed in it.

For example:

.. code-block:: bash

    $ virtualenv myenv
    $ ./myenv/bin/pip install -r tester/requirements.txt

The tester can then be run with a language/stack that was setup per its
``README.txt``:

.. code-block:: bash

    $ ./tester/run_test Python/autobahn-twisted

After the script runs, results will be saved to the ``results/`` directory.
