import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Video, Phone, Search, EllipsisVertical, Trash2, X, UserRoundX, UserRoundCheck } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useChat } from '../../../contexts/ChatContext';
import { getThemeClasses } from '../../../utils/theme';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat, updateDeletionChatList } from '../../../redux/slices/chat/chatSlice';
import axios from 'axios';


const ChatHeader = ({isBlocked,hasBlocked,setIsBlockedPopup}) => {
  const { darkMode,isMobile } = useTheme();
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const chatList = useSelector(state => state.chat.chatList);
  const user = useSelector(state => state.user)
  const themeClasses = getThemeClasses(darkMode);
  const {initiateCall,handleBlockUser} = useChat();

  const [isChatOption,setIsChatOption] = useState(false)
  const chatOptionRef = useRef(null)

  const dispatch = useDispatch();

  const handleBackToList = () =>{
    dispatch(setSelectedChat(null));
  }

  const handleChatDeletion = async () =>{
    try{

      const response = await axios.delete('http://localhost:5000/api/chat/delete-chat',{
        data:{
          participants:[user.userId,selectedChat.userId],
          userId:user.userId
        }
        })
      if(response.status === 200){
        dispatch(updateDeletionChatList(selectedChat.userId))
        dispatch(setSelectedChat(null));        
      }

    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatOptionRef.current && !chatOptionRef.current.contains(event.target)) {
        setIsChatOption(false); 
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCall = (type) =>{
    if(isBlocked){
      setIsBlockedPopup(true);
      return;
    }
    initiateCall(selectedChat,type)
  }
  
  return (
    <div>
      {/* Chat header */}
      <div className={`p-4 flex items-center justify-between border-b ${themeClasses.chatHeader}`}>
              <div className="flex items-center">
                {isMobile && (
                  <button 
                    onClick={handleBackToList} 
                    className="mr-3"
                  >
                    <ArrowLeft size={24} />
                  </button>
                )}
                <div className="relative flex items-center">
                  <div className={`w-10 h-10 rounded-full ${themeClasses.initialBg} flex items-center justify-center font-bold`}>
                    <img src={selectedChat?.avatar} alt={selectedChat?.name?.charAt(0).toUpperCase()} className='rounded-full'/>
                  </div>
                  {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div> */}
                </div>
                <div className="ml-3">
                  <div className="font-semibold">{selectedChat?.name}</div>
                  {/* <div className="text-xs text-green-500">Online</div> */}
                </div>
              </div>
              <div className="flex space-x-2 sm:space-x-4">
                <button disabled={hasBlocked} onClick={()=>handleCall('video')} className={`p-2 rounded-full ${darkMode ? `${hasBlocked ? 'text-gray-700':'text-gray-400 hover:bg-gray-700'}` : `${hasBlocked ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-200'}`}`}>
                  <Video size={22} />
                </button>
                <button disabled={hasBlocked} onClick={()=>handleCall('audio')} className={`p-2 rounded-full ${darkMode ? `${hasBlocked ? 'text-gray-700':'text-gray-400 hover:bg-gray-700'}` : `${hasBlocked ? 'text-gray-300': 'text-gray-600 hover:bg-gray-200'}`}`}>
                  <Phone size={22} />
                </button>
                <div className={`relative`} ref={chatOptionRef}>
                <button onClick={()=>setIsChatOption(prev => !prev)} className={`p-2 rounded-full ${darkMode ? `${isChatOption && 'bg-gray-700'} hover:bg-gray-700` : 'hover:bg-gray-200'}`}><EllipsisVertical size={22} className={themeClasses.headerIcon} /></button>
                 {isChatOption && 
                  <div className={`absolute z-10 right-0 top-[100%] mt-2 px-2 py-2 flex flex-col ${themeClasses.chatHeader} shadow-md border rounded-md w-max`}>
                    <button onClick={handleChatDeletion} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-100'} rounded-md text-red-500`}><Trash2 size={18}/>Delete Chat</button>
                    <button onClick={()=>handleBlockUser(selectedChat)} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-100'} rounded-md `}>{hasBlocked ?<><UserRoundCheck size={18}/>Unblock</> :<><UserRoundX size={18}/>Block</>} User</button>
                    <button onClick={handleBackToList} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-100'} rounded-md`}><X size={18}/> Close chat</button>
                  </div>}
                 </div>
              </div>
            </div>
    </div>
  )
}

export default ChatHeader
