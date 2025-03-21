import React from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import { useSelector } from 'react-redux';

const ChatListItem = ({chat,selectChat}) => {
    const { darkMode } = useTheme();
    const selectedChat = useSelector(state => state.chat.selectedChat);
    const themeClasses = getThemeClasses(darkMode);
  return (
    <div>
      <div
      key={chat._id}
      className={`flex items-center p-4 ${
        selectedChat?.userId === chat.peer.userId
          ? themeClasses.chatContactActive
          : themeClasses.chatContact
      } cursor-pointer`}
      onClick={() => selectChat(chat.peer)}
    >
      <div className="relative">
        <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
          <img src={chat.peer.avatar} alt={chat.peer.name.charAt(0).toUpperCase()} className='rounded-full'/>
        </div>
        
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-base">{chat.peer.name}</span>
          <span className={`text-xs ${themeClasses.contactStatusText}`}>{new Date(chat.updatedAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`text-sm ${themeClasses.contactStatusText} truncate w-32`}>{chat.lastMessage}</span>
          {/* {contact.unread > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {contact.unread}
            </span>
          )} */}
        </div>
      </div>
    </div>
    </div>
  )
}

export default ChatListItem
