import React from 'react'
import NoteSidebar from '../Notes/NoteSidebar'
import ChatSideBar from '../Chat/ChatSideBar'
// import {ChatSideBar} from '../Chat/ChatSideBar.jsx'

const ListSideBar = ({currentSideBar}) => {
  return (
    <div className=''>
     {currentSideBar === 'chatList' && <ChatSideBar/>}
     {currentSideBar === 'noteList' && <NoteSidebar/>}
    </div>
  )
}

export default ListSideBar
