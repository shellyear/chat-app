import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { useOutletContext } from 'react-router-dom'

import { socket } from '../../socket'
import { OutletContext } from '../../pages/ProtectedRoute'
import { SocketEvents } from '../../types/message'

type Props = {
  reciever: string
}

export function MessageInput({ reciever }: Props) {
  const { user } = useOutletContext<OutletContext>()
  const [message, setMessage] = useState('')

  const onButtonClick = () => {
    const timestamp = Date.now()
    socket.emit(SocketEvents.PRIVATE_MESSAGE, {
      senderId: user.email,
      receiverId: reciever,
      message,
      timestamp
    })
    setMessage('')
  }

  return (
    <div className="w-100 d-flex gap-3">
      <Form.Control
        name="text"
        placeholder="Type your message here"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {message && <Button onClick={onButtonClick}>Send</Button>}
    </div>
  )
}
