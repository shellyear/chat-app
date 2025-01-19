import { IoIosSend, IoMdArrowBack } from 'react-icons/io'
import { useParams } from 'react-router-dom'
import { BsThreeDotsVertical } from 'react-icons/bs'

import Avatar from '../../../../components/Avatar'

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

function Messages() {
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
  const { username, chatId } = useParams<{ username?: string; chatId?: string }>()

  if (!username && !chatId) {
    return (
      <div className="relative flex-grow flex flex-col">
        <div className="chat-background" />
      </div>
    )
  }

  return (
    <div className="flex-grow flex flex-col">
      <div className="flex items-center justify-between w-full bg-white p-4 border-b border-gray-200">
        <button type="button" className="sm:hidden">
          <IoMdArrowBack className="w-5 h-5" />
        </button>
        <div className="flex gap-4 items-center">
          <Avatar name="dsfd" size="sm" />
          <div>
            <p className="font-bold text-base leading-4">Name Surname</p>
            <p className="text-sm text-gray-500">last seen recently</p>
          </div>
        </div>
        <div>
          <BsThreeDotsVertical className="h-5 w-5 text-gray-500" />
        </div>
      </div>
      <div className="chat-background" />
      <Messages />
      <MessageInput />
    </div>
  )
}

export default ChatArea
