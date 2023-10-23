import { DocumentData, collection, doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import { db } from '../../firebase'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  text-align: left;
`

const Transition = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const TransitionSlide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;
  animation-fill-mode: forwards !important;
`

export function Messages() {
  const { targetId } = useParams()
  const [userData, setUserData] = useState<DocumentData>()

  useEffect(() => {
    if (targetId) {
      const usersRef = collection(db, 'users')
      const docRef = doc(usersRef, targetId)
      getDoc(docRef).then((doc) => {
        setUserData(doc.data())
      })
    }
  }, [targetId])

  return (
    <Layout>
      {userData && (
        <>
          <div>{userData.email}</div>
          <div>{userData.name}</div>
        </>
      )}
      <Transition>
        <TransitionSlide>
          <MessageList />
          <MessageInput reciever={targetId} />
        </TransitionSlide>
      </Transition>
    </Layout>
  )
}
