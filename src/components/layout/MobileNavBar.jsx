import React from 'react';
import { MessageCircle, Phone, Star, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';

const MobileNavBar = () => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  return (
    <div className={`md:hidden flex justify-around items-center py-3 border-t ${themeClasses.mobileNavBar}`}>
      <button className={`p-2 rounded-full ${themeClasses.navIconActive}`}>
        <MessageCircle size={24} />
      </button>
      <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
        <Phone size={24} />
      </button>
      <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
        <Star size={24} />
      </button>
      
      {/* Profile button for mobile */}
      <button className={`p-2 rounded-full ${themeClasses.initialBg}`}>
        <User size={24} />
      </button>
    </div>
  );
};

export default MobileNavBar;