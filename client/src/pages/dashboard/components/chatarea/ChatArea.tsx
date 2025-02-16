import { IoIosSend, IoMdArrowBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useEffect, useState } from 'react'

import Avatar from '../../../../components/Avatar'
import API from '../../../../api'
import { IChat } from '../../../../types/chat'
import useMsgPagination from '../../hooks/useMsgPagination'
import { useWebsocket } from '../../../../contexts/WebsocketContext'
import { PeerInfo, PeerTypes } from '../../../../types/peer'

interface MessageInputProps {
  peerType: PeerTypes
  peerId: number
}

function MessageInput({ peerId, peerType }: MessageInputProps) {
  const [text, setText] = useState('')
  const { sendMessage } = useWebsocket()

  return (
    <div className="bg-white p-4 border-t border-gray-200">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-grow mr-4 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="button"
          onClick={() => sendMessage(text, peerId, peerType)}
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <IoIosSend className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function Messages({ peerId }: { peerId: number }) {
  const { messages, totalMessages, loading, setPage } = useMsgPagination(peerId)

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {/* Sample messages */}
      <div className="flex justify-end">
        <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-xs">Hello! How are you?</div>
      </div>
      <div className="flex justify-start">
        <div className="bg-gray-200 rounded-lg py-2 px-4 max-w-xs">
          Hi there! I'm doing well, thanks for asking. How about you?
        </div>
      </div>
      {/* Add more messages as needed */}
    </div>
  )
}

function ChatArea() {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const [peerInfo, setPeerInfo] = useState<PeerInfo>()

  useEffect(() => {
    if (id) {
      API.peer.getPeerById(id).then((res) => {
        setPeerInfo(res.data)
      })
    }
  }, [id])

  if (!id) {
    return (
      <div className="relative flex-grow flex flex-col">
        <div className="chat-background" />
      </div>
    )
  }

  return (
    <div className="relative flex-grow flex flex-col">
      {peerInfo && (
        <div className="flex items-center justify-between w-full bg-white p-4 border-b border-gray-200 cursor-pointer">
          <button type="button" className="sm:hidden" onClick={() => navigate(-1)}>
            <IoMdArrowBack className="w-5 h-5" />
          </button>
          <div className="flex gap-4 items-center">
            {peerInfo?.profilePicture ? (
              <img src={peerInfo?.profilePicture} alt="profilePicture" className="w-10 h-10 rounded-full" />
            ) : (
              <Avatar name={peerInfo?.name} size="sm" />
            )}
            <div>
              <p className="font-bold text-base leading-4">{peerInfo?.name}</p>
              <p className="text-sm text-gray-500">last seen recently</p>
            </div>
          </div>
          <div>
            <BsThreeDotsVertical className="h-5 w-5 text-gray-500" />
          </div>
        </div>
      )}
      <div className="chat-background" />
      {peerInfo ? <Messages peerId={peerInfo.peerId} /> : <div className="flex-grow overflow-y-auto p-4 space-y-4" />}
      {peerInfo && <MessageInput peerId={peerInfo.peerId} peerType={peerInfo.type} />}
    </div>
  )
}

export default ChatArea
