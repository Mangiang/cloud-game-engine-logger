'use strict'

const express = require('express')
var Stomp = require('stompjs');

// Constants
const PORT = 8080
const HOST = '0.0.0.0'

// App
const app = express()
app.get('/', (req, res) => {
    res.send('Hello World From Node')
})

const stompClient = Stomp.overWS('ws://rabbitmq.default.svc.cluster.local:15674/ws')
const headers = {
    login: 'user',
    passcode: 'user',
    durable: 'true',
    'auto-delete': 'false',
}

stompClient.connect(headers, function(frame) {
    console.log('Connected')
    const subscription = stompClient.subscribe('/queue/logs/info', function(
        message,
    ) {
        console.log(message)
    })
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)