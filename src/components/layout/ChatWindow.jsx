import React from 'react'
import ListSideBar from './ListSideBar'
import ChatArea from '../pages/chat/ChatArea'

const ChatWindow = () => {
  return (
    <div className='flex flex-1 overflow-hidden'>
      <ListSideBar/>
      <ChatArea/>
    </div>
  )
}

export default ChatWindow
