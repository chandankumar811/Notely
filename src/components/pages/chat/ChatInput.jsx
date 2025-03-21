import React, { useRef, useState } from 'react';
import { Smile, Paperclip, SendHorizontal, File, ImageIcon, MoveIcon, FilmIcon, Clapperboard, Youtube, YoutubeIcon, Camera } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useChat } from '../../../contexts/ChatContext';
import { getThemeClasses } from '../../../utils/theme';
import Picker from '@emoji-mart/react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../../redux/slices/chat/chatSlice';

const ChatInput = () => {
  const { darkMode } = useTheme();
  const {sendMessage} = useChat()
  const themeClasses = getThemeClasses(darkMode);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const maxRows = 4;
  const lineHeight = 24;

  const userId = useSelector(state => state.user.userId)
  const dispatch = useDispatch();

  const handleEmojiSelect = (emoji) => {  
    console.log(emoji.native);
    setMessage(prev=>prev+emoji.native);
  }

  const toggleEmojiPicker = () => {
    setIsEmojiPickerOpen(prev=>!prev);
    setIsFilePickerOpen(false);
  }
  const toggleFilePicker = () => {
    setIsFilePickerOpen(prev=>!prev);
    setIsEmojiPickerOpen(false);
  }


  const textareaRef = useRef(null);



  const handleInput = () => {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset height for recalculation
      const maxHeight = maxRows * lineHeight; // Calculate max height
      const newHeight = Math.min(textarea.scrollHeight, maxHeight); // Limit height
      textarea.style.height = newHeight + 'px';
  };

  const handleSendMessage = (e) =>{
    e.preventDefault();
    sendMessage(message,null);
    setMessage('');
    textareaRef.current.style.height = '24px';
  }

  return (
    <div className={`p-4 border-t ${themeClasses.messageInputBorder} h-max `}>
      <div className={`flex items-center gap-5 rounded-full px-4 py-2 ${themeClasses.messageInput}`}>
        <div className='relative'>
        <button onClick={toggleEmojiPicker} className={`${isEmojiPickerOpen?'text-blue-500':'text-gray-500'}`}><Smile size={22}/></button>
        {isEmojiPickerOpen && <div className='absolute bottom-10'><Picker previewPosition='none' onEmojiSelect={handleEmojiSelect} emojiSize='28' perLine='8' set='apple'/></div>}
        </div>
        <div className='relative'>
          {isFilePickerOpen && <div className={`absolute bottom-11 p-2 rounded-lg flex flex-col gap-2 ${darkMode?'border-1 border-gray-500':'border-1 border-gray-300'} ${themeClasses.messageInput} w-max`}>
            <button className={`flex items-center text-sm font-semibold py-1 px-2 rounded-lg gap-2 ${themeClasses.fileIcon}`}><File size={22} /> <span>Document</span><input type="file" accept=".pdf, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className='w-full absolute opacity-0' /></button>
            <button className={`flex items-center text-sm font-semibold py-1 px-2 rounded-lg gap-2 ${themeClasses.fileIcon}`}><ImageIcon size={22} /> <span>Images and Videos</span><input type="file" accept="image/png, image/jpeg" className='w-full absolute opacity-0' /></button>
            {/* <button className={`flex items-center text-sm font-semibold py-1 px-2 rounded-lg gap-2 ${themeClasses.fileIcon}`}><Camera size={22} /> <span>Camera</span><input type="file" accept="image/*;capture=camera" className='w-full absolute opacity-0' /></button> */}
          </div>}
          <button onClick={toggleFilePicker} className={`${isFilePickerOpen?'text-blue-500':'text-gray-500'}`}><Paperclip size={22}  /></button>
        </div>
        <form onSubmit={handleSendMessage} className='flex w-full items-center'>
        <textarea
          ref={textareaRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows='1'
          onInput={handleInput}
          placeholder="Write a message..."
          className={`bg-transparent outline-none flex-1 resize-none ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
        />
        <button type='submit' disabled={message.length<1} className="flex items-center w-max h-max justify-center bg-blue-600 text-white p-2 rounded-full">
          <SendHorizontal size={20} />
        </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;