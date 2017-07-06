extern crate futures;
extern crate openssl;
extern crate tokio_core;
extern crate tokio_openssl;
extern crate tokio_tungstenite;
extern crate tungstenite;

use std::env;
use std::io;
use std::iter;

use futures::future::{ok, Loop, loop_fn, Either};
use futures::{Stream, Future, Sink};
use tokio_core::net::TcpListener;
use tokio_core::reactor::Core;
use tokio_openssl::SslAcceptorExt;
use tokio_tungstenite::accept_async;
use tungstenite::Error;
use tokio_tungstenite::stream::Stream as MaybeTls;

use openssl::ssl::{SslAcceptorBuilder, SslMethod};
use openssl::pkey::PKey;
use openssl::x509::X509;

fn main() {
    let port = env::var("PORT").ok().and_then(|p| p.parse().ok()).unwrap_or(9000);
    let private = include_bytes!("../../../keys/server.key");
    let public = include_bytes!("../../../keys/server.crt");
    let privkey = PKey::private_key_from_pem(private).unwrap();
    let pubkey = X509::from_pem(public).unwrap();

    let tls = if env::var("USE_SSL").map(|s| s == "true").unwrap_or(false) {
        Some(
            SslAcceptorBuilder::mozilla_modern(
                SslMethod::tls(),
                &privkey,
                &pubkey,
                iter::empty::<X509>(),
            )
                .unwrap()
                .build()
        )
    } else {
        None
    };

    let mut core = Core::new().unwrap();
    let handle = core.handle();
    let addr = format!("127.0.0.1:{}", port);
    let ws_listener = TcpListener::bind(&addr.parse().unwrap(), &handle)
        .unwrap();
    println!("running server on: {}", ws_listener.local_addr().unwrap());

    let ws_srv = ws_listener.incoming().for_each(|(socket, addr)| {
        // Perform the TLS handshake if we need to
        let io = match tls {
            Some(ref tls) => {
                Box::new(tls.accept_async(socket).then(|res| {
                    match res {
                        Ok(socket) => Ok(MaybeTls::Tls(socket)),
                        Err(e) => {
                            let e = io::Error::new(io::ErrorKind::Other, e);
                            Err(Error::Io(e))
                        }
                    }
                })) as Box<Future<Item =_, Error = _>>
            }
            None => Box::new(ok(MaybeTls::Plain(socket))),
        };

        // Perform the websocket handshake
        let ws = io.and_then(|socket| accept_async(socket));


        // Each websocket just echos messages back onto itself
        let work = ws.and_then(move |ws| {
            loop_fn(ws, |ws| {
                ws.into_future().map_err(|e| e.0).and_then(|(msg, ws)| {
                    let msg = match msg {
                        Some(msg) => msg,
                        None => return Either::A(ok(Loop::Break(()))),
                    };
                    Either::B(ws.send(msg).map(Loop::Continue))
                })
            })
        });

        // Spawn each websocket concurrently
        handle.spawn(work.then(move |res| {
            println!("{}: {:?}", addr, res);
            Ok(())
        }));

        Ok(())
    });

    core.run(ws_srv).unwrap();
}
