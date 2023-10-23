import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'

import { OutletContext } from '../../pages/ProtectedRoute'
import { SocketEvents } from '../../types/message'

const Wrapper = styled.div`
  flex: 1;
  width: 100%;
  margin-bottom: 0.5rem;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: bottom 150ms ease-out, transform var(--layer-transition);
`

const Container = styled.div`
  width: 100%;
  max-width: var(--messages-container-width);
  min-height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  padding: 1rem 1rem 0 1.125rem;
`

export function MessageList() {
  const { socket } = useOutletContext<OutletContext>()
  const [messages, setMessages] = useState()
  useEffect(() => {
    socket.on(SocketEvents.PRIVATE_MESSAGE, (data) => {
      console.log({ data })
    })
  }, [socket])
  return (
    <Wrapper>
      <Container>
        <div className="message-date-group">Message should be here</div>
      </Container>
    </Wrapper>
  )
}
