import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Cross, MessageSquarePlus, Moon, Search, Settings, Sun, UserRoundPlus, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';
import ChatList from '../pages/contact/ChatList';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ListSideBar = () => {
  const { darkMode,toggleTheme,isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const [currentSideBar, setCurrentSideBar] = useState('chatlist')
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [addNewChatOpen, setAddNewChatOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  // const [contactResult, setContactResult] = useState([]);
  const searchInputRef = useRef(null);
  const contactsearchInputRef = useRef(null);

  const userId = useSelector(state => state.user.userId);
  const selectedChat = useSelector(state => state.chat.selectedChat)
  


  const openAddContact = () => {
    setAddContactOpen(true);
    setTimeout(() => searchInputRef.current.focus(), 100);
  }
  const openAddNewChat = () => {
    setAddNewChatOpen(true);
    setTimeout(() => contactsearchInputRef.current.focus(), 100);
  }

  return (
    <>
      {/* Chat contacts sidebar - Hidden on mobile when chat is selected */}
      <div className={`${isMobile && selectedChat ? 'hidden' : 'flex'} relative h-full w-full md:w-[350px] flex-shrink-0 md:border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-col ${themeClasses.sidebar}`}>
        
      {!addContactOpen && !addNewChatOpen &&
        <div className="flex flex-col gap-3 items-center absolute bottom-8 right-5">
            <button onClick={openAddContact} className={`p-3 text-white bg-blue-600 rounded-full`}>
                <UserRoundPlus size={24} />
            </button>
            <button onClick={openAddNewChat} className={`p-3 text-white bg-blue-600 rounded-full`}>
                <MessageSquarePlus size={24} />
            </button>
        </div>}
        {/* </div> */}
          
          {/* Sidebar Header with theme toggle on mobile */}
          <div className="flex items-center justify-between p-4">
            <h1 className="font-bold text-3xl">DuoChat</h1>
            {isMobile && (<div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full ${darkMode?'text-yellow-300 bg-gray-700' : 'text-white bg-blue-500'}`}
              >
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button>
              <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
                <Settings size={24} />
            </button>
              </div>
            )}
          </div>

          
          {!addContactOpen && !addNewChatOpen &&(
          <div className="px-4 py-2">
            <div className={`flex items-center px-4 py-3 rounded-full ${themeClasses.searchBar}`}>
              <Search size={18} className={themeClasses.actionIcon} />
              <input
                type="text"
                placeholder="Search your chats..."
                onChange={(e)=>setSearchQuery(e.target.value)}
                value={searchQuery}
                className={`ml-2 bg-transparent outline-none w-full ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              />
            </div>
          </div>)}

            {currentSideBar==='chatlist' && <ChatList 
            addContactOpen={addContactOpen} 
            setAddContactOpen={setAddContactOpen} 
            searchInputRef={searchInputRef}
            addNewChatOpen={addNewChatOpen}
            setAddNewChatOpen={setAddNewChatOpen}
            contactsearchInputRef={contactsearchInputRef}
            />}

          {/* {addContactOpen &&( <>
          <div className="px-4 py-2">
             
              <button onClick={closeAddContact} className=""><ArrowLeft size={22}/></button>
              
            <div className={`group flex items-center py-3 border-b transition-all duration-200 focus-within:border-blue-500 ${darkMode ? 'border-gray-600':'border-gray-200'}`}>
              <input
                type="text"
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e)=>{setSearchQuery(e.target.value)}}
                placeholder="Search people here..."
                className={`ml-2 bg-transparent outline-none w-full ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              />
              <button onClick={()=>setSearchQuery('')}><X size={18} className={`transition-all duration-200  text-gray-500 hover:text-red-500`}
            /></button>
            </div>
          </div>

          {peopleResults.length>0 ? <div className="overflow-y-auto h-[calc(100vh-10rem)] pb-10 mt-10">
            {peopleResults.map((user) => (
              <div key={user._id}  className={`flex items-center justify-between p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
                <img src={user.avatar} alt={name.charAt(0).toUpperCase()} className='rounded-full'/>
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="font-semibold text-base">{user.name}</span>
                  <span className={`text-xs ${themeClasses.contactStatusText} `}>{user.email}</span>
                </div>
                </div>
                <button onClick={()=>requestPeople(user.userId)} className='py-1.5 px-3 text-white bg-blue-500 rounded-full text-xs'>
                  Request
                </button>
            </div>))}
          </div>:
          <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
            <p className="text-gray-500">No results found</p>
          </div>
          }

            </>)} */}


            
        </div>
    </>
  )
}

export default ListSideBar
