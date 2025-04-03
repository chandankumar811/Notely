import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../../contexts/ThemeContext';
import { setSelectedChat, setStarChatList } from '../../../redux/slices/chat/chatSlice';
import axios from 'axios'
import ChatListItem from './ChatListItem';

const StarChatList = () => {
    const {darkMode} = useTheme();
    const dispatch = useDispatch();

    const user = useSelector(state => state.user)
    const starChatList = useSelector(state => state.chat.starChatList)

    useEffect(()=>{
          const fetchChatList = async () => {
            const size = 'star'
            try {
                const response = await axios.get(`http://localhost:5000/api/chat/get-chats/${user.userId}/${size}`);
                if(response.status === 200){
                  console.log(response.data);
                  dispatch(setStarChatList(response.data));
                }
              } catch (error) {
                    console.error("Search failed:", error);
              }
          }
          if (user.userId) fetchChatList();
        }, [user.userId, dispatch]);

    const selectChat = (chat) => {
      dispatch(setSelectedChat(chat));
    }

  return (
    <div>
      <div className="relative flex justify-between">
            <div className="px-4 py-3 text-base text-gray-500" >Starred Chats</div>   
          </div>
            
          <div className="overflow-y-auto custom-scrollbar h-[calc(100vh-15rem)] md:h-[calc(100vh-10rem)] pb-10">
            {starChatList.length > 0 ? starChatList.map((chat) => (
              <ChatListItem key={chat._id} chat={chat} selectChat={selectChat}/>
            )):
            <div className={`absolute w-fit text-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 `}>
              <span className={`text-sm ${darkMode?'text-gray-400':'text-gray-600'}`}>No Starred Chats Found!!!</span>
            </div>}
          </div>      
    </div>
  )
}

export default StarChatList
