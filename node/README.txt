The server has been tested with Node v0.10.38, v0.12.2, and io.js 1.8.1, the
latest releases as of 2015-05-04. Node v0.10.38 and v0.12.2 ship with
OpenSSL 1.0.1m; io.js 1.8.1 ships with OpenSSL 1.0.2a.

You can use nvm to switch between releases for testing:

$ git clone https://github.com/creationix/nvm.git ~/.nvm
$ cd ~/.nvm
$ git checkout `git describe --abbrev=0 --tags`
$ echo 'source ~/.nvm/nvm.sh' >> ~/.profile && source ~/.profile

$ nvm install 0.10.38
$ nvm install 0.12.2
$ nvm install iojs-v1.8.1

$ nvm use 0.10.38
$ npm install # Only needed for dependency updates or first use.
$ ./run
$ nvm deactivate # Restore the system-installed version.
