import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import { useSelector } from 'react-redux';
import { Download, File, Play, PlayCircle } from 'lucide-react';
import MediaPreview from './MediaPreview';

const MessageBubble = ({ message }) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const userId = useSelector(state => state.user.userId)

  const [fileDetails, setFileDetails] = useState({ filename: "", size: null });
  const [showMediaPreview, setShowMediaPreview] = useState(false);

  useEffect(() => {
    if (message.messageType === "document" && message.attachment) {
      // Extract filename from URL
      const urlParts = message.attachment.split("/");
      const originalName = urlParts[urlParts.length - 1].split('_');
      const filename = originalName[originalName.length - 1];

      // Fetch file size using HEAD request
      fetch(message.attachment, { method: "HEAD" })
        .then(res => {
          const size = res.headers.get("content-length"); // Size in bytes
          setFileDetails({
            filename: decodeURIComponent(filename),
            size: size ? (size / 1048576).toFixed(2) + " MB" : "Unknown",
          });
        })
        .catch(err => console.error("Error fetching file details:", err));
    }
  }, [message]);

  const isSelf = message.senderId === userId;

  const renderMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    if(!message) return
    
    return message.split(urlRegex).map((part, index) => 
      urlRegex.test(part) ? (
        <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="italic underline break-all">
          {part}
        </a>
      ) : (
        part
      )
    );
  };
  

  return (
    <div>
      {showMediaPreview && (
        <MediaPreview 
          src={message.attachment} 
          type={message.messageType}
          onClose={() => setShowMediaPreview(false)} 
        />
      )}
      <div className={`mb-6 flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>

<div className={`max-w-xs md:max-w-md`}>
  {message.attachment ? (
    <div className={`p-2 pb-1 rounded-lg ${message.senderId === userId ? themeClasses.selfMessage : themeClasses.otherMessage}`}>
      <div onClick={() => message.messageType !=='document' && setShowMediaPreview(true)} className={`w-full max-w-[200px] max-h-[200px] ${themeClasses.imagePlaceholder} rounded-lg flex items-center justify-center text-center`}>
        {message.messageType ==='image' && <img src={message.attachment} alt="img" className='w-full h-full rounded-lg'/>}
        {message.messageType ==='video' && 
        <div className="relative">
        <video src={message.attachment} alt="video" className='w-full h-full rounded-lg' controls={false}/>
        <div className="absolute flex items-center justify-center inset-0 rounded-lg bg-black/10 text-gray-300 w-full h-full"><Play size={20} /></div>
        </div>}
          {message.messageType === 'document' && (
                  <div className={`
                    flex items-center 
                    w-full h-full
                    rounded-lg 
                    p-3 
                    space-x-3 
                    ${isSelf 
                      ? (darkMode 
                        ? 'bg-blue-800/50 text-white' 
                        : 'bg-blue-100 text-blue-900')
                      : (darkMode 
                        ? 'bg-gray-700 text-gray-200 border-1 border-gray-600' 
                        : 'bg-gray-200 text-gray-800')
                    }
                  `}>
                    <div className={`
                      p-2 
                      rounded-lg 
                      flex 
                      items-center 
                      justify-center
                      ${isSelf 
                        ? (darkMode 
                          ? 'bg-white/20 text-blue-400' 
                          : 'bg-white/60 text-blue-600') 
                        : (darkMode 
                          ? 'bg-white/10 text-gray-300' 
                          : 'bg-white/70 text-gray-600')
                      }
                    `}>
                      <File size={40} />
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <div 
                        className="font-medium text-sm truncate" 
                        title={fileDetails.filename}
                      >
                        {fileDetails.filename}
                      </div>
                      <div className={`
                        text-xs 
                        ${isSelf 
                          ? (darkMode ? 'text-blue-200' : 'text-blue-700') 
                          : (darkMode ? 'text-gray-400' : 'text-gray-600')
                        }
                      `}>
                        {fileDetails.size}
                      </div>
                    </div>
                    
                    <button 
                      className={`
                        p-2 
                        rounded-full 
                        transition-colors 
                        ${isSelf 
                          ? (darkMode 
                            ? 'text-white hover:bg-blue-500' 
                            : 'text-blue-600 hover:bg-blue-300')
                          : (darkMode 
                            ? 'text-gray-300 hover:bg-gray-600/90' 
                            : 'text-gray-600 hover:bg-gray-100')
                        }
                      `}
                      onClick={() => window.open(message.attachment, '_blank')}
                    >
                      <Download size={20} />
                    </button>
                  </div>
                )}

      </div>
      <div className={`flex flex-col py-2 ml-auto w-full max-w-[200px] max-h-[200px]`} >
        <p className='whitespace-pre-line'>{renderMessage(message?.message)}</p>
        <span className='flex text-[10px] items-end text-gray-300 text-nowrap ml-auto'>{new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</span>
      </div>
    </div>
  ) : (
    <div className={`flex gap-3 px-4 py-2 rounded-lg ${message.senderId === userId ? themeClasses.selfMessage : themeClasses.otherMessage}`} >
      <p className='whitespace-pre-line'>{renderMessage(message?.message)}</p>
      <span className='flex text-[10px] items-end text-gray-300 text-nowrap'>{new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</span>
    </div>
  )}
  
</div>
</div>
    </div>
  )
}

export default MessageBubble
