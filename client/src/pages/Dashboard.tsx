import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import styled from 'styled-components'

import { ControlPanel } from '../components/chat/ControlPanel'
import { Messages } from '../components/chat/Messages'
import { OutletContext } from './ProtectedRoute'
import { SocketEvents } from '../types/message'

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
`

const LeftColumn = styled.aside`
  flex-basis: 40%;
`

const RightColumn = styled.div`
  flex-basis: 60%;
  background: lightblue;
`

export function Dashboard() {
  const { socket, user } = useOutletContext<OutletContext>()

  useEffect(() => {
    const onConnect = () => {
      console.log('client socket connected to BE')
    }
    socket.on('connect', onConnect)

    socket.connect()
    socket.emit(SocketEvents.SET_USER, {
      id: user.email,
      name: user.displayName,
      email: user.email
    })

    return () => {
      socket.off('connect', onConnect)
      socket.disconnect()
    }
  }, [socket, user.displayName, user.email])

  return (
    <Wrapper>
      <LeftColumn>
        <ControlPanel />
      </LeftColumn>
      <RightColumn>
        <Messages />
      </RightColumn>
    </Wrapper>
  )
}
