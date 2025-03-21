import React from 'react';
import { MessageCircle, Phone, Star, Settings, User, MessageSquareText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';
import Logo from '../../assets/LOGO.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch,useSelector } from 'react-redux';
import { logout } from '../../redux/slices/user/userSlice';

const NavSidebar = () => {
  const { darkMode ,toggleTheme} = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const name = useSelector((state) => state.user.name);
  const avatar = useSelector((state) => state.user.avatar);

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
        <button className={`p-2 rounded-full ${themeClasses.navIconActive}`}>
          <MessageSquareText size={24} />
        </button>
        <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
          <Phone size={24} />
        </button>
        <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
          <Star size={24} />
        </button>
        <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
          <Settings size={24} />
        </button>
      </div>
      
      {/* Theme toggle switch */}
      <div className="mt-auto mb-4">
        {/* <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full ${themeClasses.themeIcon}`}
              >
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button> */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                value="" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={toggleTheme}
              />
              <div className={`w-11 h-6 ${darkMode ? 'bg-blue-600' : 'bg-gray-200'} peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
            </label>
      </div>
      
      {/* User profile */}
      <div className="mt-4">
        <div onClick={handleLogout} className={`w-10 h-10 rounded-full ${themeClasses.initialBg} flex items-center justify-center`}>
          <img src={avatar} alt={name.charAt(0).toUpperCase()} className='rounded-full'/>
        </div>
      </div>
    </div>
  );
};

export default NavSidebar;