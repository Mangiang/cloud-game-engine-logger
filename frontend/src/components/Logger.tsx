import React, { useEffect } from 'react'
import { w3cwebsocket as W3CWebSocket, IMessageEvent } from 'websocket'
import { useState } from 'react'

// import { Client, Message, Frame } from '@stomp/stompjs'

// export function connectRabbit() {}

const Logger = () => {
  const [ messages, setMessages ] = useState<string[]>([])
  const [ client, setClient ] = useState<W3CWebSocket>()

  useEffect(() => {
    let myClient = new W3CWebSocket('ws://localhost/plugins/cloud-game-engine-logger-backend/ws')
    myClient.onopen = () => {
      console.log('WebSocket Client Connected')
    }
    myClient.onmessage = (message: IMessageEvent) => {
      console.log(message)
      const data = JSON.parse(message.data.toString());
      setMessages(() => messages.concat([data.value]))
    }
    setClient(myClient)
  }, [])

  
  const msgs = []
  for (const [index, value] of messages.entries()) {
    msgs.push(<li key={index}>{value}</li>)
  }
  
  return (
    <div className="Logger">
      {msgs}
    </div>
  )
}

export default Logger
