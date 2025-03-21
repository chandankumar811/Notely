import React, { useState, useEffect } from 'react';
import { MessageCircle, Archive, Users, Phone, Settings, Search, Video, Paperclip, Smile, Send, ArrowLeft, Sun, Moon, User, Star, EllipsisVertical, SendHorizontal, UserRoundPlus } from 'lucide-react';
import Logo from './assets/LOGO.png';

const ChatApp = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentChat, setCurrentChat] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen size is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };
  const handleChatSelect = (name) => {
    setCurrentChat(name);
  };

  const handleBackToList = () => {
    setCurrentChat(null);
  };

  const contacts = [
    { id: 1, name: 'Jammie', initial: 'J', status: 'Music', time: '9:36', online: true, pinned: true, unread: 0 },
    { id: 2, name: 'Maribel', initial: 'M', status: "Walk Don't Run", time: '12:02', online: false, pinned: true, unread: 2 },
    { id: 3, name: 'Liza', initial: 'L', status: 'Alone Again (Naturally)', time: '10:35', online: true, unread: 3 },
    { id: 4, name: 'Kris', initial: 'K', status: "What'd I Say", time: '04:00', online: true, unread: 0 },
    { id: 5, name: 'Chauncey', initial: 'C', status: 'Monday Monday', time: '08:42', online: false, unread: 0 },
  ];

  const messages = [
    { id: 1, text: 'Hi 👋, How are ya ?', sender: 'other', time: 'Today', initial: 'S' },
    { id: 2, text: 'Hi 👋 Panda, not bad, u ?', sender: 'self', label: 'You' },
    { id: 3, text: 'Can you send me an abstract image?', sender: 'self', label: 'You' },
    { id: 4, text: 'Ya sure, sending you a pic', sender: 'other', initial: 'S' },
    { id: 5, text: 'Wooden chairs on striped rug', sender: 'other', initial: 'S', isImage: true },
  ];

  // Dynamic classes based on theme
  const themeClasses = {
    container: darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800',
    sidebar: darkMode ? 'bg-gray-800' : 'bg-[#f8faff]',
    navSidebar: darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    chatHeader: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    chatArea: darkMode ? 'bg-gray-900' : 'bg-[#f8faff]',
    searchBar: darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700',
    chatContact: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200',
    chatContactActive: darkMode ? 'bg-gray-700' : 'bg-blue-100',
    messageInput: darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800',
    messageInputBorder: darkMode ? 'border-gray-700' : 'border-gray-200',
    selfMessage: darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
    otherMessage: darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800 border border-gray-200',
    navIcon: darkMode ? 'text-gray-400 hover:text-blue-600 hover:bg-gray-800' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100',
    navIconActive: darkMode ? 'bg-gray-800 text-blue-500' : 'bg-gray-100 text-blue-600',
    headerIcon: darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200',
    timeText: darkMode ? 'text-gray-500' : 'text-gray-400',
    initialBg: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700',
    contactStatusText: darkMode ? 'text-gray-500' : 'text-gray-500',
    contactInitialBg: darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-300 text-gray-700',
    sectionLabel: darkMode ? 'text-gray-500' : 'text-gray-500',
    imagePlaceholder: darkMode ? 'bg-gray-600' : 'bg-gray-300',
    actionIcon: darkMode ? 'text-gray-500' : 'text-gray-500',
    mobileNavBar: darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
    themeIcon: darkMode ? 'text-gray-300' : 'text-gray-700',
  };

  return (
    <div className={`flex flex-col h-screen ${themeClasses.container}`}>
      {/* Main content container - flex column on mobile, row on desktop */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar - Only visible on desktop */}
        <div className={`hidden md:flex w-16 flex-shrink-0 border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-col items-center py-4 ${themeClasses.navSidebar}`}>
          {/* App logo */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-8">
            {/* <div className="text-white text-xl">🦉</div> */}
            <div className="text-white text-xl">
                <img src={Logo} alt="DC" className='w-7 h-7'/>
            </div>
          </div>
          
          {/* Navigation icons */}
          <div className="flex flex-col items-center space-y-8 flex-1">
            <button className={`p-2 rounded-full ${themeClasses.navIconActive}`}>
              <MessageCircle size={24} />
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
            <div className={`w-10 h-10 rounded-full ${themeClasses.initialBg} flex items-center justify-center`}>
                <User size={24} />
            </div>
          </div>
        </div>

        {/* Chat contacts sidebar - Hidden on mobile when chat is selected */}
        <div className={`${isMobile && currentChat ? 'hidden' : 'flex'} relative w-full md:w-[350px] flex-shrink-0 md:border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-col ${themeClasses.sidebar}`}>
        <button className={`absolute bottom-8 right-5 p-3 text-white bg-blue-600 rounded-full`}>
                <UserRoundPlus size={24} />
        </button>
        {/* </div> */}
          
          {/* Sidebar Header with theme toggle on mobile */}
          <div className="flex items-center justify-between p-4">
            <h1 className="font-bold text-3xl">DuoChat</h1>
            {isMobile && (<div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme} 
                className={`p-2 rounded-full hover:bg-gray-700 ${themeClasses.themeIcon}`}
              >
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
              </button>
              <button className={`p-2 rounded-full ${themeClasses.navIcon}`}>
                <Settings size={24} />
            </button>
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="px-4 py-2">
            <div className={`flex items-center px-4 py-3 rounded-full ${themeClasses.searchBar}`}>
              <Search size={18} className={themeClasses.actionIcon} />
              <input
                type="text"
                placeholder="Search..."
                className={`ml-2 bg-transparent outline-none w-full ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
              />
            </div>
          </div>

          {/* Archive button
          <div className="px-4 py-2 flex items-center text-blue-500">
            <Archive size={20} />
            <span className="ml-2 text-base">Archive</span>
          </div> */}

          {/* Pinned section */}
          <div className="px-4 py-3 text-base text-gray-500">All Chats</div>

          {/* Contacts list */}
          <div className="overflow-y-auto flex-1">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center p-4 ${
                  currentChat === contact.name
                    ? themeClasses.chatContactActive
                    : themeClasses.chatContact
                } cursor-pointer`}
                onClick={() => handleChatSelect(contact)}
              >
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
                    {contact.initial}
                  </div>
                  {/* {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  )} */}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">{contact.name}</span>
                    <span className={`text-xs ${themeClasses.contactStatusText}`}>{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${themeClasses.contactStatusText} truncate w-32`}>{contact.status}</span>
                    {contact.unread > 0 && (
                      <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area - Hidden on mobile when no chat is selected */}
        {(currentChat) ? (
          <div className={`${isMobile && !currentChat ? 'hidden' : 'flex'} flex-1 flex flex-col`}>
            {/* Chat header */}
            <div className={`p-4 flex items-center justify-between border-b ${themeClasses.chatHeader}`}>
              <div className="flex items-center">
                {isMobile && (
                  <button 
                    onClick={handleBackToList} 
                    className="mr-3"
                  >
                    <ArrowLeft size={24} />
                  </button>
                )}
                <div className="relative flex items-center">
                  <div className={`w-10 h-10 rounded-full ${themeClasses.initialBg} flex items-center justify-center font-bold`}>
                    {currentChat?.initial}
                  </div>
                  {/* <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div> */}
                </div>
                <div className="ml-3">
                  <div className="font-semibold">{currentChat?.name}</div>
                  {/* <div className="text-xs text-green-500">Online</div> */}
                </div>
              </div>
              <div className="flex space-x-4">
                <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Video size={22} className={themeClasses.headerIcon} />
                </button>
                <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Phone size={22} className={themeClasses.headerIcon} />
                </button>
                <button className={`hidden md:block p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Search size={22} className={themeClasses.headerIcon} />
                </button>
                <button className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                <EllipsisVertical size={22} className={themeClasses.headerIcon} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className={`flex-1 p-4 overflow-y-auto ${themeClasses.chatArea}`}>
              {messages.map((message) => (
                <div key={message.id} className={`mb-6 flex ${message.sender === 'self' ? 'justify-end' : 'justify-start'}`}>
                  {/* {message.sender === 'other' && (
                    <div className="flex-shrink-0 mr-3">
                      <div className={`w-8 h-8 rounded-full ${themeClasses.initialBg} flex items-center justify-center`}>
                        {message.initial}
                      </div>
                    </div>
                  )} */}
                  <div className={`max-w-xs md:max-w-md`}>
                    {message.isImage ? (
                      <div className={`p-1 rounded-lg ${themeClasses.otherMessage}`}>
                        <div className={`w-full h-48 ${themeClasses.imagePlaceholder} rounded-lg flex items-center justify-center text-center p-4`}>
                          {message.text}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`px-4 py-2 rounded-4xl ${
                          message.sender === 'self' ? themeClasses.selfMessage : themeClasses.otherMessage
                        }`}
                      >
                        {message.text}
                      </div>
                    )}
                    {/* {message.time && (
                      <div className={`text-xs ${themeClasses.timeText} mt-1 ml-1`}>{message.time}</div>
                    )} */}
                  </div>
                  {/* {message.sender === 'self' && (
                    <div className={`flex-shrink-0 ml-2 text-xs ${themeClasses.timeText} self-end mb-1`}>
                      {message.label}
                    </div>
                  )} */}
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className={`p-4 border-t ${themeClasses.messageInputBorder}`}>
              <div className={`flex items-center gap-5 rounded-full px-4 py-2 ${themeClasses.messageInput}`}>
                <Smile size={22} className={themeClasses.actionIcon} />
                <Paperclip size={22} className={themeClasses.actionIcon} />
                <input
                  type="text"
                  placeholder="Write a message..."
                  className={`bg-transparent outline-none flex-1 text-base ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                />
                <button className="flex items-center justify-center bg-blue-600 text-white p-2 rounded-full">
                  <SendHorizontal size={20} />
                </button>
              </div>
            </div>
          </div>
        ):
        <div className="flex-1 flex items-center justify-center">
          <div className="text-md text-gray-500">Select a chat to start messaging</div>
          </div>
        }
      </div>

      {/* Mobile bottom navigation - Only visible on mobile */}
      {/* {isMobile && (
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
          <button className={`p-2 rounded-full ${themeClasses.initialBg}`}>
            <User size={24} />
          </button>
        </div>
      )} */}
    </div>
  );
};

export default ChatApp;