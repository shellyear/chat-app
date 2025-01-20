import { useState, useEffect } from 'react'

import API from '../../../api'

const useMsgPagination = (chatId: string, initialPage = 1, pageSize = 20) => {
  const [page, setPage] = useState(initialPage)
  const [messages, setMessages] = useState([])
  const [totalMessages, setTotalMessages] = useState(0)
  const [loading, setLoading] = useState(false)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const response = await API.chat.getChatMessages(chatId, page, pageSize)
      setMessages(response.data.messages)
      setTotalMessages(response.data.pagination.totalMessages)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return {
    messages,
    totalMessages,
    loading,
    setPage
  }
}

export default useMsgPagination
