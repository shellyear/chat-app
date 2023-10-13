import React from 'react'

import { ControlPanel } from '../components/chat/ControlPanel'
import { Messages } from '../components/chat/Messages'

export function Dashboard() {
  return (
    <div>
      <ControlPanel />
      <Messages />
    </div>
  )
}
