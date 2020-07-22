'use strict'

const express = require('express')
Object.assign(global, { WebSocket: require('ws') });
var StompJs = require('@stomp/stompjs');

// Constants
const WS_PORT = 8081
const HTTP_PORT = 80
const HOST = '0.0.0.0'

// HTTP serveur for Readyness and liveliness
const app = express()
app.get('/', (req, res) => {
    res.send('Hello World From Node')
})
app.listen(HTTP_PORT, HOST)
console.log(`HTTP Running on http://${HOST}:${HTTP_PORT}`)


// Stomp cliend for RabbitMQ
const client = new StompJs.Client({
    brokerURL: "ws://rabbitmq.default.svc.cluster.local:15674/ws",
    connectHeaders: {
        login: "user",
        passcode: "user"
    },
    debug: function(str) {
        console.log(str);
    },
    reconnectDelay: 2000,
    heartbeatIncoming: 1000,
    heartbeatOutgoing: 1000
});

client.onConnect = function(frame) {
    // Do something, all subscribes must be done is this callback
    // This is needed because this will be executed after a (re)connect
    console.log('Stomp Connected')
    const subscription = client.subscribe('/queue/logs/info', function(
        message,
    ) {
        console.log(message)
    })
};

client.onStompError = function(frame) {
    // Will be invoked in case of error encountered at Broker
    // Bad login/passcode typically will cause an error
    // Complaint brokers will set `message` header with a brief message. Body may contain details.
    // Compliant brokers will terminate the connection after any error
    console.log('Broker reported error: ' + frame.headers['message']);
    console.log('Additional details: ' + frame.body);
};
client.activate();


// Websocket for the frontend
const wss = new WebSocket.Server({ host: HOST, port: WS_PORT });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    // ws.send('something');
    console.log(`WS Running on ws://${HOST}:${WS_PORT}`)
});