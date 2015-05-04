package main

import (
	"code.google.com/p/go.net/websocket"
	"fmt"
	"net/http"
	"os"
)

func echoHandler(ws *websocket.Conn) {
	echoChan := make(chan string)
	go func() {
		for data := range echoChan {
			websocket.Message.Send(ws, data)
		}
	}()

	var d string
	for true {
		err := websocket.Message.Receive(ws, d)
		if err != nil {
			echoChan <- d
		}
	}
}

func main() {
	var err error
	port := ":9000"
	if portString := os.Getenv("SERVER_PORT"); portString != "" {
		port = ":" + portString
	}
	useSSL := os.Getenv("USE_SSL") == "true"
	http.Handle("/", websocket.Handler(echoHandler))

	fmt.Printf("Running server on port %s\n", port)
	if useSSL {
		err = http.ListenAndServeTLS(port, "../../keys/server.crt", "../../keys/server.key", nil)
	} else {
		err = http.ListenAndServe(port, nil)
	}
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
