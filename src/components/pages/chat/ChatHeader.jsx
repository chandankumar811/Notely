import React from 'react'
import { ArrowLeft, Video, Phone, Search, EllipsisVertical } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useChat } from '../../../contexts/ChatContext';
import { getThemeClasses } from '../../../utils/theme';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedChat } from '../../../redux/slices/chat/chatSlice';


const ChatHeader = () => {
  const { darkMode,isMobile } = useTheme();
  const selectedChat = useSelector(state => state.chat.selectedChat);
  const themeClasses = getThemeClasses(darkMode);
  const {initiateCall} = useChat();

  const dispatch = useDispatch();

  const handleBackToList = () =>{
    dispatch(setSelectedChat(null));
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
              <div className="flex space-x-4">
                <button onClick={()=>initiateCall('video')} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Video size={22} className={themeClasses.headerIcon} />
                </button>
                <button onClick={()=>initiateCall('audio')} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Phone size={22} className={themeClasses.headerIcon} />
                </button>
                <button className={`hidden md:block p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Search size={22} className={themeClasses.headerIcon} />
                </button>
                <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <EllipsisVertical size={22} className={themeClasses.headerIcon} />
                </button>
              </div>
            </div>
    </div>
  )
}

export default ChatHeader
