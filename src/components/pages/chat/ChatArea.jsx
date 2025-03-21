import React, { useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import { useDispatch, useSelector } from 'react-redux';
import NoMessage from './NoMessage';
import axios from 'axios';
import {setMessages } from '../../../redux/slices/chat/chatSlice';

const ChatArea = () => {
    const { darkMode,isMobile } = useTheme();
    const themeClasses = getThemeClasses(darkMode);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);


    const selectedChat = useSelector(state => state.chat.selectedChat);
    const userId = useSelector(state => state.user.userId);
    const messages = useSelector(state=>state.chat.messages)
    const messageAreaRef = useRef(null);

    useEffect(()=>{
      const fetchMessages = async () =>{
      try{
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/chat/fetch/messages/${userId}/${selectedChat.userId}`)
        if(response.status === 200){
          console.log(response.data.messages)
          dispatch(setMessages(response.data.messages))
        }
      }catch(err){
        console.log(err)
      } finally {
        setLoading(false);
      }
    }
      if(userId && selectedChat)fetchMessages();
    },[userId,selectedChat])


    useEffect(()=>{
      if(messageAreaRef.current){
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
      }
    },[messages])

  return (
    <div className='w-full'>
        {(selectedChat) ? (
          <div className={`${isMobile && !selectedChat ? 'hidden' : 'flex'} flex-1 flex flex-col h-full`}>
            <ChatHeader/>
            {/* Messages area */}
            {loading ? (
          <div className={`flex flex-1 p-4 items-center justify-center ${themeClasses.chatArea}`}>
            <div className="text-md text-gray-500">Loading messages...</div>
          </div>
        ) : messages?.length > 0 ? (
          <div ref={messageAreaRef} className={`flex-1 p-4 overflow-y-auto scroll-smooth custom-scrollbar ${themeClasses.chatArea}`}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>
        ) : (
          <div className={`flex flex-1 p-4 items-center justify-center ${themeClasses.chatArea}`}>
            <NoMessage />
          </div>
        )}
        
            {/* Chat input */}
            <ChatInput/>
        </div>
        ):(
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-md text-gray-500">Select a chat to start messaging</div>
        </div>
        )}
    </div>
  )
}

export default ChatArea
