import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";
import { Camera, Mic, Paperclip, Send, SmileIcon } from "lucide-react";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  return (
    <div className={`flex border-t w-full p-2 ${themeClasses.chatHeader}`}>
      <div className="flex w-full">
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full">
            <SmileIcon size={24} />
          </button>
          <button className="p-2 rounded-full">
            <Paperclip size={24} />
          </button>
        </div>
        <div className="w-full rounded-full flex items-center pl-4 gap-3">
          <input
          onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Type your message ..."
            className={`w-full pl-4 py-2 pr-10 relative ${themeClasses.messageInput} outline-none rounded-full`}
          />
          <button className="absolute right-5 text-blue-500">
          {message ?   <Send size={20} /> : <Mic size={20}/> }
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
