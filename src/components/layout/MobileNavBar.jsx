import React, { useState } from 'react';
import { LogOut, MessageCircle, MessageSquareText, NotebookPen, Phone, Star, User, UserRound } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';
import { useDispatch,useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../../redux/slices/user/userSlice';
import { setSelectedChat } from '../../redux/slices/chat/chatSlice';

const MobileNavBar = ({currentSideBar,setCurrentSideBar}) => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const themeClasses = getThemeClasses(darkMode);
  const name = useSelector((state) => state.user.name);
  const avatar = useSelector((state) => state.user.avatar);
  const [isProfileOption,setIsProfileOption] = useState(false)
  const [imageError,setImageError] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`md:hidden flex justify-around items-center h-[60px] border-t ${themeClasses.mobileNavBar}`}>
      <button onClick={()=>setCurrentSideBar('chatList')} className={`p-2 rounded-full ${currentSideBar==='chatList'?themeClasses.navIconActive:themeClasses.navIcon}`}>
          <MessageSquareText size={24} />
        </button>
        <button onClick={()=>{setCurrentSideBar('callHistory');dispatch(setSelectedChat(null))}} className={`p-2 rounded-full ${currentSideBar==='callHistory'?themeClasses.navIconActive:themeClasses.navIcon}`}>
          <Phone size={24} />
        </button>
        <button className={`p-2 rounded-full ${currentSideBar==='noteList'? themeClasses.navIconActive:themeClasses.navIcon}`} onClick={()=>setCurrentSideBar('noteList')}>
          <NotebookPen size={24}/>
        </button>
        <button onClick={()=>setCurrentSideBar('starChats')} className={`p-2 rounded-full ${currentSideBar==='starChats'?themeClasses.navIconActive:themeClasses.navIcon}`}>
          <Star size={24} />
        </button>
      
        <div className="relative">
        <button onClick={()=>setIsProfileOption(prev => !prev)} className={`w-10 h-10 rounded-full ${themeClasses.initialBg} flex items-center justify-center`}>
        {imageError ? (
            <UserRound size={20} className="text-gray-500" /> // Lucide icon fallback
          ) : (
          <img src={avatar} alt={name.charAt(0).toUpperCase()} onError={()=>setImageError(true)} className='w-full h-full object-cover rounded-full'/>
          )}
        </button>
        {isProfileOption && 
          <div className={`absolute z-10 -left-15 bottom-12 mt-2 px-2 py-2 flex flex-col ${themeClasses.chatHeader} shadow-md border rounded-md w-max`}>
            <button onClick={()=>{setCurrentSideBar('userProfile');setIsProfileOption(false)}} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-200'} rounded-md `}><UserRound size={18}/>Profile</button>
            <button onClick={handleLogout} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-200'} rounded-md`}><LogOut size={18}/>Logout</button>
          </div>}
      </div>
    </div>
  );
};

export default MobileNavBar;