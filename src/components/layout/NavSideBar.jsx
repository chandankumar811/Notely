import React, { useEffect, useState } from 'react';
import { MessageCircle, Phone, Star, Settings, User, MessageSquareText, Moon, Sun, UserRound, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';
import Logo from '../../assets/LOGO.png';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../../redux/slices/user/userSlice';
import ThemeButton from './ThemeButton';
import { setSelectedChat } from '../../redux/slices/chat/chatSlice';

const NavSidebar = ({setCurrentSideBar,currentSideBar}) => {
  const { darkMode ,toggleTheme} = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const [isProfileOption,setIsProfileOption] = useState(false)
  const [imageError,setImageError] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  const avatar = useSelector((state) => state.user.avatar);

  useEffect(()=>{
    if(currentSideBar){
      setIsProfileOption(false)
    }
  },[currentSideBar])

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <div className={`hidden md:flex w-16 flex-shrink-0 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-col items-center py-4 ${themeClasses.navSidebar}`}>
      {/* App logo */}
      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-8">
        <div className="text-white text-xl">
          <img src={Logo} alt="DC" className='w-7 h-7'/>
        </div>
      </div>
      
      {/* Navigation icons */}
      <div className="flex flex-col items-center space-y-8 flex-1">
        <button onClick={()=>setCurrentSideBar('chatList')} className={`p-2 rounded-full ${currentSideBar==='chatList'?themeClasses.navIconActive:themeClasses.navIcon}`}>
          <MessageSquareText size={24} />
        </button>
        <button onClick={()=>setCurrentSideBar('callHistory')} className={`p-2 rounded-full ${currentSideBar==='callHistory'?themeClasses.navIconActive:themeClasses.navIcon}`}>
          <Phone size={24} />
        </button>
        <button onClick={()=>setCurrentSideBar('starChats')} className={`p-2 rounded-full ${currentSideBar==='starChats'?themeClasses.navIconActive:themeClasses.navIcon}`}>
          <Star size={24} />
        </button>
        {/* <button className={`p-2 rounded-full ${currentSideBar==='settings'?themeClasses.navIconActive:themeClasses.navIcon}`}>
          <Settings size={24} />
        </button> */}
      </div>
      
      {/* Theme toggle switch */}
      <div className="">
        <ThemeButton toggleTheme={toggleTheme} darkMode={darkMode}/>
      </div>
      
      {/* User profile */}
      <div className="relative mt-4">
        <button onClick={()=>setIsProfileOption(prev => !prev)} className={`w-10 h-10 rounded-full ${themeClasses.initialBg} flex items-center justify-center`}>
          {imageError ? (
                      <UserRound size={20} className="text-gray-500" /> // Lucide icon fallback
                    ) : (
                    <img src={avatar} alt={name.charAt(0).toUpperCase()} onError={()=>setImageError(true)} className='w-full h-full object-cover rounded-full'/>
                    )}
        </button>
        {isProfileOption && 
          <div className={`absolute z-10 left-[120%] bottom-2 mt-2 px-2 py-2 flex flex-col ${themeClasses.chatHeader} shadow-md border rounded-md w-max`}>
            <button onClick={()=>{setCurrentSideBar('userProfile');setIsProfileOption(false)}} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-200'} rounded-md `}><UserRound size={18}/>Profile</button>
            <button onClick={handleLogout} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-200'} rounded-md`}><LogOut size={18}/>Logout</button>
          </div>}
      </div>
    </div>
  );
};

export default NavSidebar;