import React from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import { useSelector } from 'react-redux';

const MessageBubble = ({ message }) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const userId = useSelector(state => state.user.userId)

  return (
    <div>
      <div key={message.id} className={`mb-6 flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>

<div className={`max-w-xs md:max-w-md`}>
  {message.attachment ? (
    <div className={`p-2 pb-1 rounded-lg ${message.senderId === userId ? themeClasses.selfMessage : themeClasses.otherMessage}`}>
      <div className={`w-full max-w-[200px] max-h-[200px] ${themeClasses.imagePlaceholder} rounded-lg flex items-center justify-center text-center`}>
        <img src={message.attachment} alt="img" className='w-full h-full rounded-lg'/>
      </div>
      <div className={`flex flex-col py-2 ml-auto w-full max-w-[200px] max-h-[200px]`} >
        <p className='whitespace-pre-line'>{message.message}</p>
        <span className='flex text-[10px] items-end text-gray-300 text-nowrap ml-auto'>{new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</span>
      </div>
    </div>
  ) : (
    <div className={`flex gap-3 px-4 py-2 rounded-4xl ${message.senderId === userId ? themeClasses.selfMessage : themeClasses.otherMessage}`} >
      <p className='whitespace-pre-line'>{message.message}</p>
      <span className='flex text-[10px] items-end text-gray-300'>{new Date(message.timestamp).toLocaleTimeString('en-US', {
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
