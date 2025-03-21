import React, { useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { useChat } from '../../../contexts/ChatContext';

const NoMessage = () => {
    const { darkMode } = useTheme();
    const {sendMessage} = useChat()
    const gifs = [
    'http://localhost:5000/files/gifs/CuteHello.gif',
    'http://localhost:5000/files/gifs/StrawberryHello.gif',
    'http://localhost:5000/files/gifs/ClipHello.gif',
    'http://localhost:5000/files/gifs/RabbitHello.gif',
    ]

    const [randomGif] = useState(() => gifs[Math.floor(Math.random() * gifs.length)]);

  return (
    <div className={`flex flex-col items-center justify-center w-65 text-center ${darkMode? 'bg-[rgba(0,0,0,0.3)]':'bg-[rgba(0,0,0,0.05)]'} rounded-2xl p-4`}>
        <span className={`font-semibold ${darkMode?'text-gray-300':'text-gray-700'}`}>No messages here yet...</span>
        <span className={`text-sm ${darkMode?'text-gray-600':'text-gray-500'}`}>Send a message or click on the greeting below</span>
        <img src={randomGif} alt="" className='h-30 w-30 mt-4 cursor-pointer' onClick={()=>sendMessage(null,randomGif)}/>
    </div>
  )
}

export default NoMessage
