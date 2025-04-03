import { Moon, Sun } from 'lucide-react'
import React from 'react'

const ThemeButton = ({toggleTheme,darkMode}) => {
  return (
      <div className={`flex items-center relative w-12 h-7 px-[4px] rounded-full cursor-pointer shadow-inner
              ${darkMode 
                ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600' 
                : 'bg-gradient-to-r from-yellow-300 via-orange-400 to-yellow-500'
              }`} 
            onClick={toggleTheme}>
            <div 
              className={`absolute flex w-5 h-5 bg-white rounded-full shadow-lg items-center justify-center transition-all duration-300 ease-in-out
                ${darkMode ? 'translate-x-5' : 'translate-x-0'}`}>
      
              {!darkMode ? (
                <Sun 
                  color="#FF8C00" 
                  size={15} 
                  className="transition-all duration-300 rotate-0 hover:rotate-45" 
                />
              ) : (
                <Moon 
                  color="#1E40AF" 
                  size={15} 
                  className="transition-all duration-300 scale-100 hover:scale-110" 
                />
              )}
            </div>
          </div>
  )
}

export default ThemeButton
