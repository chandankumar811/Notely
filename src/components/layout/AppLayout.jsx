import React from 'react'
import NavSidebar from './NavSideBar'
import ListSideBar from './ListSideBar'
import ChatArea from '../pages/chat/ChatArea'
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';
import MobileNavBar from './MobileNavBar';
import CallLayout from './CallLayout';

const AppLayout = () => {
  const { darkMode,isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  return (
    <div>
      <div className={`flex flex-col w-full h-screen ${themeClasses.container}`}>
      {/* Main content container - flex column on mobile, row on desktop */}
      <div className=" relative w-full flex flex-1 overflow-hidden">
        <NavSidebar/>
        <ListSideBar/>
        <ChatArea/>
        <div className="absolute z-10"><CallLayout/></div>
      </div>
      <MobileNavBar/>
      </div>
    </div>
  )
}

export default AppLayout
