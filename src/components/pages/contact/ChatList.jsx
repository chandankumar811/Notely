import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import ChatListItem from './ChatListItem';
import { ArrowLeft, X } from 'lucide-react';
import ContactRequestItem from './ContactRequestItem';
import axios from 'axios';
import { useSelector,useDispatch } from 'react-redux';
import { setSelectedChat,setChatList, updateChatList } from '../../../redux/slices/chat/chatSlice';

const ChatList = ({addContactOpen,setAddContactOpen,searchInputRef,addNewChatOpen,setAddNewChatOpen,contactsearchInputRef}) => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const [activeList, setActiveList] = useState('chatList');
  const [contactRequests,setContactRequests] = useState([])
  const [contactResult, setContactResult] = useState([]);
  const chatList = useSelector(state => state.chat.chatList);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('')
  const [peopleResults, setPeopleResults] = useState([]);
  

  const userId = useSelector(state => state.user.userId);
  const chat = useSelector((state) => state.chat.selectedChat);
  const dispatch = useDispatch();

  useEffect(()=>{
  const fetchRequests = async () => {
    try {
        const { data } = await axios.get(`http://localhost:5000/api/contact/get-requests/${userId}`);
        setContactRequests(data);
        console.log(data);
      } catch (error) {
            console.error("Search failed:", error);
      }
  }
  fetchRequests();
  },[]);

  const acceptRequest = async (contactId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/contact/accept-request/${userId}`,{
        query:contactId
      });
      if(response.status===200){
        console.log("accepted",contactId)
        const newRequests = contactRequests.filter(contact=>contact.userId!==contactId)
        setContactRequests([...newRequests])
        console.log(contactRequests)
      }
  } catch (error) {
      console.error("Search failed:", error);
  }
  }
  
   
  
    const searchPeople = async () => {
      if (!searchQuery.trim()) {
        setPeopleResults([]);
        return
      };
          try {
              const { data } = await axios.get(`http://localhost:5000/api/contact/new/people/${userId}?query=${searchQuery}`);
              setPeopleResults(data);
              // console.log(searchInputRef.current);
              console.log(data);
          } catch (error) {
              console.error("Search failed:", error);
          }
    }
    
  
    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        searchPeople();
      }, 500); 
  
      return () => clearTimeout(delayDebounce);
    }, [searchQuery]); 

    const searchContact = async () => {
            if (!contactSearchQuery.trim()) {
              setContactResult([]);
              return
            };
                try {
                    const { data } = await axios.get(`http://localhost:5000/api/contact/search-contact/${userId}?query=${contactSearchQuery}`);
                    setContactResult(data);
                    console.log(data);
                } catch (error) {
                    console.error("Search failed:", error);
                }
          }
          
        
          useEffect(() => {
            const delayDebounce = setTimeout(() => {
              searchContact();
            }, 500); 
        
            return () => clearTimeout(delayDebounce);
          }, [contactSearchQuery]); 
  
    const requestPeople = async (contactId) => {
      try {
        const response = await axios.post(`http://localhost:5000/api/contact/request/people/${userId}`,{
          query:contactId
        });
        if(response.status===200){
          console.log("requested",contactId)
        }
    } catch (error) {
        console.error("Search failed:", error);
    }
  }
  
  
    const closeAddContact = () => {
      setAddContactOpen(false);
      setSearchQuery('');
      setPeopleResults([]);
    }
    const closeAddNewChat = () => {
      setAddNewChatOpen(false);
      setContactSearchQuery('');
      setContactResult([]);
    }
    
    const selectChat = (chat) => {
      dispatch(setSelectedChat(chat));
    }

    const selectChatContact = async (contact) => {
      // dispatch(setSelectedChat(contact));

      const isChat = chatList.some(chat => chat.peer.userId === contact.userId)
      if(isChat){
        selectChat(contact);
      }
      else{
      try{
        const peerId = contact.userId
        const response = await axios.post(`http://localhost:5000/api/chat/new-chat`,{
          userId:userId,
          peerId:peerId
        })
        if(response.status === 200){
          const res = response.data.addedChat
          dispatch(updateChatList(res))
          selectChat(res.peer);
        }
        
      }catch(error){
        console.error("Search failed:", error);
      }
    }
      closeAddNewChat();
    }


    useEffect(()=>{
      const fetchChatList = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/api/chat/get-chats/${userId}`);
            console.log(data);
            dispatch(setChatList(data));
          } catch (error) {
                console.error("Search failed:", error);
          }
      }
      if (userId) fetchChatList();
}, [userId, dispatch]);

  return (

  <div className="">
    {!addContactOpen && !addNewChatOpen &&(<>
    <div className="relative flex justify-between">
      {activeList==='chatList' ? <div className="px-4 py-3 text-base text-gray-500" onClick={()=>console.log(chat)}>All Chats</div>:<button className='px-4' onClick={()=>setActiveList('chatList')}><ArrowLeft size={22}/></button>}
      <div className='flex'>
        <button className="px-4 py-3 text-base text-blue-500 ml-auto" onClick={()=>setActiveList('requestList')}>Requests</button>
        {contactRequests.length>0 && <span className="absolute top-2 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">{contactRequests.length}</span>}
      </div>
    </div>
      
    <div className="overflow-y-auto h-[calc(100vh-10rem)] pb-10">
      {activeList==='chatList' && chatList.map((chat) => (
        <ChatListItem key={chat._id} chat={chat} selectChat={selectChat}/>
      ))}
      {activeList==='requestList' && contactRequests.map((contact) => (
        <ContactRequestItem key={contact._id} contact={contact} acceptRequest={acceptRequest}/>
      ))}
    </div></>)}

      {/* add new contact */}
    {addContactOpen &&( <>
              <div className="p-3">
                 
                  <button onClick={closeAddContact} className=""><ArrowLeft size={22}/></button>
                  
                <div className={`group flex flex-1 items-center py-3 border-b transition-all duration-200 focus-within:border-blue-500 ${darkMode ? 'border-gray-600':'border-gray-200'}`}>
                  <input
                    type="text"
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(e)=>{setSearchQuery(e.target.value)}}
                    placeholder="Search new people to add..."
                    className={`ml-2 bg-transparent outline-none w-full ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                  />
                  {/* <button onClick={()=>setSearchQuery('')}><X size={18} className={`transition-all duration-200  text-gray-500 hover:text-red-500`}
                /></button> */}
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
    
                </>)}

                {/* start new chat */}
    {addNewChatOpen &&( <>
              <div className="p-3">
                 
                  <button onClick={closeAddNewChat} className=""><ArrowLeft size={22}/></button>
                  
                <div className={`group flex flex-1 items-center py-3 border-b transition-all duration-200 focus-within:border-blue-500 ${darkMode ? 'border-gray-600':'border-gray-200'}`}>
                  <input
                    type="text"
                    ref={contactsearchInputRef}
                    value={contactSearchQuery}
                    onChange={(e)=>{setContactSearchQuery(e.target.value)}}
                    placeholder="Search to start new chat..."
                    className={`ml-2 bg-transparent outline-none w-full ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
                  />
                  {/* <button onClick={()=>setContactSearchQuery('')}><X size={18} className={`transition-all duration-200  text-gray-500 hover:text-red-500`}
                /></button> */}
                </div>
              </div>
    
              {contactResult.length>0 ? <div className="overflow-y-auto h-[calc(100vh-10rem)] pb-10 mt-10">
                {contactResult.map((contact) => (
                  <div key={contact._id} onClick={()=>selectChatContact(contact)} className={`flex items-center justify-between p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
                  <img src={contact.avatar} alt={contact.name.charAt(0).toUpperCase()} className='rounded-full'/>
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span className="font-semibold text-base">{contact.name}</span>
                    <span className={`text-xs ${themeClasses.contactStatusText} `}>{contact.email}</span>
                  </div>
                  </div>
              </div>))}
              </div>:
              <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
                <p className="text-gray-500">No results found</p>
              </div>
              }
    
                </>)}
  </div>
  )
}

export default ChatList
