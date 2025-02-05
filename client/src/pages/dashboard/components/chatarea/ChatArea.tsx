import { IoIosSend, IoMdArrowBack } from 'react-icons/io'
import { Location, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useEffect, useState } from 'react'

import Avatar from '../../../../components/Avatar'
import API from '../../../../api'
import { IChat } from '../../../../types/chat'
import useMsgPagination from '../../hooks/useMsgPagination'
import { IUser } from '../../../../types/user'
import { getIdMetadata, IdTypeEnum } from '../../../../utils/chat'

function MessageInput() {
  return (
    <div className="bg-white p-4 border-t border-gray-200">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow mr-4 p-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="button"
          className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <IoIosSend className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

function Messages({ chatId }: { chatId: string }) {
  const { messages, totalMessages, loading, setPage } = useMsgPagination(chatId)

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
  const [participant, setParticipant] = useState<IUser>()
  const [chat, setChat] = useState<IChat>()

  const fetchCommunity = async (uniqueName: string) => {
    await API.uniqueName.getCommunityInfoByUniqueName(uniqueName)
  }

  useEffect(() => {
    if (!id) return
    const idMetadata = getIdMetadata(id)
    if (!idMetadata) return

    if (idMetadata.type === IdTypeEnum.UNIQUE_NAME) {
      fetchCommunity(idMetadata.id)
      // fetch base on @uniquName
    }

    if (idMetadata.type === IdTypeEnum.USER) {
      // fetch based on UserId
    }

    if (idMetadata.type === IdTypeEnum.CHANNEL) {
      // fetch base on channelId
    }

    if (idMetadata.type === IdTypeEnum.GROUP_CHAT) {
      // fetch based on groupChat
    }

    if (idMetadata.type === IdTypeEnum.CHAT) {
      // fetch based on chatId
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
      <div className="flex items-center justify-between w-full bg-white p-4 border-b border-gray-200 cursor-pointer">
        <button type="button" className="sm:hidden" onClick={() => navigate(-1)}>
          <IoMdArrowBack className="w-5 h-5" />
        </button>
        <div className="flex gap-4 items-center">
          {participant?.profilePicture ? (
            <img src={participant?.profilePicture} alt="profilePicture" className="w-10 h-10 rounded-full" />
          ) : (
            <Avatar name={participant?.name} size="sm" />
          )}
          <div>
            <p className="font-bold text-base leading-4">
              {participant?.name} {participant?.surname}
            </p>
            <p className="text-sm text-gray-500">last seen recently</p>
          </div>
        </div>
        <div>
          <BsThreeDotsVertical className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <div className="chat-background" />
      {chat?._id ? <Messages chatId={chat._id} /> : <div className="flex-grow overflow-y-auto p-4 space-y-4" />}
      <MessageInput />
    </div>
  )
}

export default ChatArea
