import React from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import { Check, X } from 'lucide-react';

const ContactRequestItem = ({contact,acceptRequest}) => {
    const { darkMode } = useTheme();
    const themeClasses = getThemeClasses(darkMode);
  return (
    <div>
      <div key={contact._id}  className={`flex items-center justify-between p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
                <img src={contact.avatar} alt={contact.name.charAt(0).toUpperCase()} className='w-full h-full object-cover rounded-full'/>
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="font-semibold text-base">{contact.name}</span>
                  <span className={`text-xs ${themeClasses.contactStatusText} `}>{contact.email}</span>
                </div>
                </div>
                <div className="flex gap-2">
                <button className='p-1 text-red-500 rounded-full text-xs hover:bg-red-500 hover:text-white transition-all duration-200'>
                  <X size={18}/>
                </button>
                <button onClick={()=>acceptRequest(contact.userId)} className='p-1 text-blue-500 rounded-full text-xs hover:bg-blue-500 hover:text-white transition-all duration-200'>
                  <Check size={18}/>
                </button>
                </div>
            </div>
    </div>
  )
}

export default ContactRequestItem
