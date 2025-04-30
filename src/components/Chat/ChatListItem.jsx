import React from "react";
import { MessageSquare, CheckCheck, FileText, ImageIcon } from 'lucide-react';
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";

const ChatListItem = ({chats}) => {
    const {darkMode, isMobile} = useTheme()
    const themeClasses = getThemeClasses(darkMode)
  return (
    <div className="flex-1 overflow-y-auto w-full pb-20">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center p-3  ${themeClasses.item} ${darkMode ? "text-gray-100" : "text-gray-800"} border-b`}
        >
          <div className="relative mr-3">
            {chat.avatar ? (
              <img
                src="vite.svg"
                alt={chat.name}
                className="w-12 h-12 rounded-full"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                {chat.isGroup ? (
                  <MessageSquare size={24} className="text-gray-400" />
                ) : (
                  <div className="text-lg font-semibold text-gray-300">
                    {chat.name.charAt(0)}
                  </div>
                )}
              </div>
            )}
            {chat.isOnline && (
              <div className="absolute bottom-0 right-0 bg-blue-500 w-3 h-3 rounded-full border-2 border-gray-800"></div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold truncate">{chat.name}</h3>
              <span className="text-xs text-gray-400">{chat.time}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <div className="flex items-center text-sm text-gray-400 truncate">
                {chat.isOnline && (
                  <span className="flex items-center text-blue-500 mr-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                    Video call
                  </span>
                )}
                {chat.hasMedia && (
                  <ImageIcon size={14} className="mr-1" />
                )}
                {chat.hasFile && (
                  <FileText size={14} className="mr-1" />
                )}
                {chat.hasLink && (
                  <CheckCheck size={14} className="mr-1" />
                )}
                <span className="truncate">
                  {chat.status ? chat.status : chat.lastMessage}
                </span>
              </div>
              {chat.unread > 0 && (
                <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unread}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatListItem;
