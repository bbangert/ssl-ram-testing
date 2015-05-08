The servers have been tested with Node v0.10.38, v0.12.2, and io.js 2.0.1,
the latest releases as of 2015-05-08. Node v0.10.38 and v0.12.2 ship with
OpenSSL 1.0.1m; io.js ships with OpenSSL 1.0.2a as of 1.8.1.

You can use nvm to switch between releases for testing:

$ git clone https://github.com/creationix/nvm.git ~/.nvm
$ cd ~/.nvm
$ git checkout `git describe --abbrev=0 --tags`
$ echo 'source ~/.nvm/nvm.sh' >> ~/.profile && source ~/.profile

$ nvm install 0.10.38
$ nvm install 0.12.2
$ nvm install iojs-v2.0.1

$ cd {ws | faye}
$ nvm use {iojs-v2.0.1 | 0.12.2 | 0.10.38}
$ npm install # Only needed for dependency updates or first use.
$ ./run
$ nvm deactivate # Restore the system-installed version.
