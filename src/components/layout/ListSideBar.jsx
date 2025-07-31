import React, { createContext, useEffect, useRef, useState } from 'react'
import { ArrowLeft, Cross, MessageSquarePlus, Moon, PencilIcon, Search, Settings, Sun, UserRoundPlus, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext';
import { getThemeClasses } from '../../utils/theme';
import ChatList from '../pages/contact/ChatList';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ThemeButton from './ThemeButton';
import CallHistory from '../pages/call/CallHistory';
import StarChatList from '../pages/contact/StarChatList';
import NoteList from '../pages/Note/NoteList';
import { useNote } from '../../contexts/NoteContext';

const ListSideBar = ({currentSideBar}) => {
  const { darkMode,toggleTheme,isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  // const [currentSideBar, setCurrentSideBar] = useState('chatlist')
  const [addContactOpen, setAddContactOpen] = useState(false)
  const [addNewChatOpen, setAddNewChatOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  // const [contactResult, setContactResult] = useState([]);

  

  const searchInputRef = useRef(null);
  const contactsearchInputRef = useRef(null);

  const userId = useSelector(state => state.user.userId);
  const selectedChat = useSelector(state => state.chat.selectedChat)
  const selectedCallHistory = useSelector(state => state.chat.selectedCallHistory)
  const selectedNote = useSelector(state => state.note.selectedNote)
  const {setAddNewNoteOpen, addNewNoteOpen} = useNote();

  const openAddContact = () => {
    setAddContactOpen(true);
    setTimeout(() => searchInputRef.current.focus(), 100);
  }
  const openAddNewChat = () => {
    setAddNewChatOpen(true);
    setTimeout(() => contactsearchInputRef.current.focus(), 100);
  }

  const getPlaceholder = () =>{
    if(currentSideBar==='chatList'){
      return 'Search your chats...'
    }else if(currentSideBar==='callHistory'){
      return 'Search your call history...'
    }else if(currentSideBar==="noteList"){
      return 'Search your notes...'
    }

  }

  return (
    <>
      {/* Chat contacts sidebar - Hidden on mobile when chat is selected */}
      <div className={`${(isMobile && selectedChat) || (isMobile && selectedCallHistory) || (isMobile && selectedNote) || (isMobile && addNewNoteOpen) ? 'hidden' : 'flex'} relative h-full w-full md:w-[350px] flex-shrink-0 md:border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-col ${themeClasses.sidebar}`}>
        
      {!addContactOpen && !addNewChatOpen && currentSideBar==='chatList' &&
        <div className="flex flex-col gap-3 items-center absolute bottom-8 right-5">
            <button onClick={openAddContact} className={`p-3 text-white bg-blue-600 rounded-full`}>
                <UserRoundPlus size={24} />
            </button>
            <button onClick={openAddNewChat} className={`p-3 text-white bg-blue-600 rounded-full`}>
                <MessageSquarePlus size={24} />
            </button>
        </div>}

        {currentSideBar==="noteList" &&
          <div className='flex absolute bottom-8 right-5'>
            <button className={`p-3 text-white bg-blue-600 rounded-full`} onClick={() => setAddNewNoteOpen(true)}>
              <PencilIcon size={24}/>
            </button>
          </div>
        }
        {/* </div> */}
          
          {/* Sidebar Header with theme toggle on mobile */}
          <div className="flex items-center justify-between p-4">
            <h1 className="font-bold text-3xl">Notely</h1>
            {isMobile && (<div className="flex items-center space-x-4">
              <ThemeButton toggleTheme={toggleTheme} darkMode={darkMode}/>
              {/* <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
                <Settings size={24} />
            </button> */}
              </div>
            )}
          </div>

          
          {!addContactOpen && !addNewChatOpen &&(
          <div className="px-4 py-2">
            <div className={`flex items-center px-4 py-3 rounded-full ${themeClasses.searchBar}`}>
              <Search size={18} className={themeClasses.actionIcon} />
              <input
                type="text"
                placeholder={getPlaceholder()}
                onChange={(e)=>setSearchQuery(e.target.value)}
                value={searchQuery}
                className={`ml-2 bg-transparent outline-none w-full ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              />
            </div>
          </div>)}

            {currentSideBar==='chatList' && <ChatList 
            addContactOpen={addContactOpen} 
            setAddContactOpen={setAddContactOpen} 
            searchInputRef={searchInputRef}
            addNewChatOpen={addNewChatOpen}
            setAddNewChatOpen={setAddNewChatOpen}
            contactsearchInputRef={contactsearchInputRef}
            />}

          {currentSideBar==='callHistory' && <CallHistory/>}

          {currentSideBar==='noteList' && <NoteList/>}

          {currentSideBar==='starChats' && <StarChatList/>}
          
        </div>
    </>
  )
}

export default ListSideBar
