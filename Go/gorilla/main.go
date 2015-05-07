package main

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"os"
)

type message struct {
	Type int
	Body []byte
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func echoHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade:", err)
		return
	}
	defer conn.Close()

	echoChan := make(chan message)
	defer close(echoChan)

	go func() {
		for m := range echoChan {
			conn.WriteMessage(m.Type, m.Body)
		}
	}()

	for {
		mt, b, err := conn.ReadMessage()
		if err != nil {
			echoChan <- message{mt, b}
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

	http.HandleFunc("/", echoHandler)
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
