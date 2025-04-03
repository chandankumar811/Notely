import React, { useEffect, useRef, useState } from 'react';
import { Smile, Paperclip, SendHorizontal, File, ImageIcon, MoveIcon, FilmIcon, Clapperboard, Youtube, YoutubeIcon, Camera, X } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useChat } from '../../../contexts/ChatContext';
import { getThemeClasses } from '../../../utils/theme';
import Picker from '@emoji-mart/react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../../redux/slices/chat/chatSlice';
import axios from 'axios'

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ChatInput = ({setIsBlockedPopup,isBlocked,hasBlocked}) => {
  const { darkMode } = useTheme();
  const {sendMessage,handleBlockUser} = useChat()
  const themeClasses = getThemeClasses(darkMode);

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);

  
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const maxRows = 4;
  const lineHeight = 24;
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const userId = useSelector(state => state.user.userId)
  const selectedChat = useSelector(state => state.chat.selectedChat)
  const blockedContacts = useSelector(state => state.user.blockedContacts)
  const dispatch = useDispatch();

  const handleEmojiSelect = (emoji) => {  
    console.log(emoji.native);
    setMessage(prev=>prev+emoji.native);
    textareaRef.current.focus();
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


  const handleFileSelect = (e, fileType) => {
    const file = e.target.files[0]; // Select only the first file

    if (!file) return; // If no file is selected, return

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds the 5MB limit. Please select a smaller file.");
      return;
    }
    
    // Check if file meets the type criteria
    const isValidFile = fileType === 'image' 
      ? file.type.startsWith('image/') || file.type.startsWith('video/') 
      : file.type.startsWith('application/');
    
    if (isValidFile) {
      // Revoke previous file's object URL if exists
      if (selectedFile) {
        URL.revokeObjectURL(selectedFile.preview);
      }

      // Create new file object with preview and details
      const fileWithPreview = {
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' 
              : file.type.startsWith('video/') ? 'video' 
              : 'document',
        name: file.name,
        size: formatFileSize(file.size),
        extension: file.name.split('.').pop().toUpperCase()
      };

      setSelectedFile(fileWithPreview);
      setIsFilePickerOpen(false);
      textareaRef.current.focus();
    }
  };

  const removeFile = () => {
    // Revoke the object URL to free up memory
    if (selectedFile) {
      URL.revokeObjectURL(selectedFile.preview);
      setSelectedFile(null);
    }
  };

  const handleInput = () => {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset height for recalculation
      const maxHeight = maxRows * lineHeight; // Calculate max height
      const newHeight = Math.min(textarea.scrollHeight, maxHeight); // Limit height
      textarea.style.height = newHeight + 'px';
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('file', selectedFile.file);
    const response = await axios.post('http://localhost:5000/api/chat/upload-file',formData);

    if(response.status === 200){
      const {fileUrl} = response.data;
      console.log(fileUrl)
      return fileUrl;
    }
    return null;
  }
  

  const handleSendMessage = async (e) =>{
    e.preventDefault();
    if(isBlocked){
      setIsBlockedPopup(true);
      return
    }
    let attachment = null;
    if(selectedFile){
      console.log('Uploading file...')
      attachment = await handleFileUpload();
    }
    const messageType = selectedFile ? selectedFile.type : 'text';
    sendMessage(message,attachment,messageType);
    setMessage('');
    removeFile();
    textareaRef.current.style.height = '24px';
    setIsEmojiPickerOpen(false);
    textareaRef.current.focus();
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line behavior
      
      // Only send if there's a message or a file
      if (message.trim().length > 0 || selectedFile) {
        handleSendMessage(e);
      }
    }
    // Allow new line on Shift + Enter
    else if (e.key === 'Enter' && e.shiftKey) {
      // Default behavior will add a new line
      handleInput(); // Adjust textarea height
    }
  }



  return (
    <div className={`${!hasBlocked && 'p-4'} border-t ${themeClasses.messageInputBorder} h-max `}>
       {selectedFile && (
        <div className={`flex w-max gap-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-[10px] mb-2`}>
          <div className="relative flex flex-col w-max">
            {selectedFile.type === 'image' && (
              <div className="">
                <img 
                  src={selectedFile.preview} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className={`text-[10px] pt-1`}>
                  {selectedFile.size}
                </div>
              </div>
            ) }
            {selectedFile.type === 'video' && (
               <div className="">
               <video 
                 src={selectedFile.preview} 
                 alt="Video Preview" 
                 className="w-20 h-20 object-cover rounded-lg"
                 controls={false}
               />
               <div className={`text-[10px] pt-1`}>
                 {selectedFile.size}
               </div>
             </div>)}
             {selectedFile.type === 'document' && (
              <>
              <div className={`w-20 h-20 flex flex-col items-center justify-center rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
                <File size={32} className="text-gray-500" />
                <div className="text-xs text-center mt-1">{selectedFile.extension}</div>
              </div>
                <div className={`text-[10px] p-0.5`}>
                  {selectedFile.size}
                </div>
              <div className="text-xs break-line line-clamp-2 w-[150px]">
                {selectedFile.name}
              </div>
              </>
            )}
            
            {/* Remove Button */}
            <button 
              onClick={removeFile}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={12} />
            </button>
          </div>
        </div>
      )}
      <div className={`flex items-center gap-5 rounded-full px-4 py-2 ${!hasBlocked && themeClasses.messageInput}`}>
       {hasBlocked? 
       (<div className="w-full flex items-center justify-center gap-5">
          <span className="text-xs sm:text-md text-center">You have blocked <em className='underline'>{selectedChat.name}</em>, you can't message.</span>
          <button onClick={()=>handleBlockUser(selectedChat)} className={`text-xs text-white bg-blue-500 px-2 py-1 rounded-lg `}>{hasBlocked?'Unblock':'Block'}</button>
       </div> ):

        (<><div className='relative'>
        <button onClick={toggleEmojiPicker} className={`${isEmojiPickerOpen?'text-blue-500':'text-gray-500'}`}><Smile size={22}/></button>
        {isEmojiPickerOpen && <div className='absolute bottom-10'><Picker previewPosition='none' onEmojiSelect={handleEmojiSelect} emojiSize='28' perLine='8' set='apple'/></div>}
        </div>
        <div className='relative'>
          {isFilePickerOpen && <div className={`absolute bottom-11 p-2 rounded-lg flex flex-col gap-2 ${darkMode?'border-1 border-gray-500':'border-1 border-gray-300'} ${themeClasses.messageInput} w-max`}>
            <button className={`flex items-center text-sm font-semibold py-1 px-2 rounded-lg gap-2 ${themeClasses.fileIcon}`} onChange={(e) => handleFileSelect(e, 'document')} ><File size={22} /> <span>Document</span><input type="file" accept=".pdf, .doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className='w-full absolute opacity-0' /></button>
            <button className={`flex items-center text-sm font-semibold py-1 px-2 rounded-lg gap-2 ${themeClasses.fileIcon}`} onChange={(e) => handleFileSelect(e, 'image')} ><ImageIcon size={22} /> <span>Images and Videos</span><input type="file" accept="image/png, image/jpeg, video/mp4, video/webm, video/ogg" className='w-full absolute opacity-0' /></button>
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
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className={`bg-transparent outline-none flex-1 resize-none ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
        />
        <button type='submit' disabled={!selectedFile && message.length<1} className="flex items-center w-max h-max justify-center bg-blue-600 text-white p-2 rounded-full">
          <SendHorizontal size={20} />
        </button>
        </form></>)}
      </div>
    </div>
  );
};

export default ChatInput;