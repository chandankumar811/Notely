import React,{useState} from 'react'
import NavSidebar from './NavSideBar'
import ListSideBar from './ListSideBar'
import ChatArea from '../pages/chat/ChatArea'
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';
import MobileNavBar from './MobileNavBar';
import CallLayout from './CallLayout';
import { useSelector } from 'react-redux';

const AppLayout = () => {
  const { darkMode,isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const callStatus = useSelector(state => state.chat.callStatus)
  const [currentSideBar, setCurrentSideBar] = useState('chatList')
  return (
    <div>
      <div className={`flex flex-col w-full h-screen overflow-hidden ${themeClasses.container}`}>
      {/* Main content container - flex column on mobile, row on desktop */}
      <div className=" relative w-full h-[calc(100vh-55px)] sm:h-full flex flex-1">
        <NavSidebar setCurrentSideBar={setCurrentSideBar} currentSideBar={currentSideBar}/>
        {currentSideBar !== 'userProfile' && <ListSideBar currentSideBar={currentSideBar}/>}
        <ChatArea currentSideBar={currentSideBar} setCurrentSideBar={setCurrentSideBar}/>
      <div className={`absolute w-full h-full ${(callStatus === 'ongoing' || callStatus === 'idle')?'pointer-events-none':''}`}><CallLayout/></div>
      </div>
      <MobileNavBar setCurrentSideBar={setCurrentSideBar} currentSideBar={currentSideBar}/>
      </div>
    </div>
  )
}

export default AppLayout
