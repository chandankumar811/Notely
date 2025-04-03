import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import axios from 'axios'
import { updateStarChatList } from '../../../redux/slices/chat/chatSlice';

const ChatListItem = ({chat,selectChat}) => {
    const { darkMode } = useTheme();
    const user = useSelector(state => state.user)
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const themeClasses = getThemeClasses(darkMode);
    const [isStarChat,setIsStarChat] = useState(false)
    const dispatch = useDispatch();

    const toggleStarChat = async () =>{
      try{
        const participants = [user.userId,chat.peer.userId];
        const response = await axios.post('http://localhost:5000/api/chat/toggle-star-chat',{userId:user.userId,participants})
        if(response.status===200){
          setIsStarChat(prev=>!prev)
          dispatch(updateStarChatList({isStar:!isStarChat,chat,userId:user.userId}))
        }
      }catch(err){
        console.log(err)
      }
    }

    useEffect(()=>{
      if(chat?.starBy?.includes(user.userId)){
        setIsStarChat(true)
      }
    },[chat,user])
  return (
    <div>
      <div
      key={chat._id}
      className={`relative flex items-center p-4 ${
        selectedChat?.userId === chat.peer.userId
          ? themeClasses.chatContactActive
          : themeClasses.chatContact
      } cursor-pointer`}
      onClick={() => selectChat(chat.peer)}
    >
        <button onClick={(e)=>{ e.stopPropagation();toggleStarChat()}} className={`absolute p-1 top-1 right-1 ${darkMode?'bg-gray-800':'bg-gray-50'} rounded-full text-yellow-500`}>
          <Star fill={isStarChat ? 'yellow':'none'} size={18} />
        </button>
      <div className="relative">
        <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
          <img src={chat.peer.avatar} alt={chat.peer.name.charAt(0).toUpperCase()} className='w-full h-full object-cover rounded-full'/>
        </div>
        
      </div>
      <div className="ml-3 flex-1 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="flex font-semibold text-base">{chat.peer.name}</span>
          <div className={`flex items-center gap-1 text-sm ${themeClasses.contactStatusText} truncate w-32`} dangerouslySetInnerHTML={{ __html: chat.lastMessage }}></div>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-xs ${themeClasses.contactStatusText}`}>{new Date(chat.updatedAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</span>
          
        </div>
      </div>
    </div>
    </div>
  )
}

export default ChatListItem
