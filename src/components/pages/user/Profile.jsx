import React, { useEffect, useState, useRef } from 'react'
import {useTheme} from '../../../contexts/ThemeContext'
import {useChat} from '../../../contexts/ChatContext'
import { getThemeClasses } from '../../../utils/theme';
import { Check, EllipsisVertical, Mail, MapPinHouse, Pencil, Phone, Trash2, Upload, UserRound, UserRoundCheck, UserRoundX, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
import { updateUserAddress, updateUserAvatar, updateUserPhoneNumber } from '../../../redux/slices/user/userSlice';

const Profile = ({setCurrentSideBar}) => {
  const { darkMode } = useTheme();
  const {handleBlockUser} = useChat();
  const themeClasses = getThemeClasses(darkMode);
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [contactResult, setContactResult] = useState([]);
  const [blockedContactList, setBlockedContactList] = useState([]);
  const [currentList, setCurrentList] = useState('all');
  const [activeContactId, setActiveContactId] = useState(null);
  const [imageError, setImageError] = useState(false);
  
  // Avatar update related states
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const addressInputRef = useRef(null);

  const [isPhoneEdit,setIsPhoneEdit] = useState(false)
  const [isAddressEdit,setIsAddressEdit] = useState(false)
  const [phone,setPhone] = useState('Not Set');
  const [address,setAddress] = useState('Not Set');

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/contact/fetch-contact/${user.userId}`);
        if(response.status === 200){
          setContactResult(response.data);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Search failed:", error);
      }
    };
    fetchContact();
  }, []); 

  const checkBlocked = (userId) => {
    const blockedContacts = user.blockedContacts;
    return blockedContacts.some(contact => contact.userId === userId);
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async () => {
    if (!selectedImage) return;
    
    setUploading(true);
    const formData = new FormData();
    const userId = user.userId
    formData.append('userId', userId);
    formData.append('file', selectedImage);
    console.log(user.userId,formData.get('userId'))
    
    try {
      const response = await axios.post('http://localhost:5000/api/user/update-user-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }});
      
      if (response.status === 200) {
        
        dispatch(updateUserAvatar(response.data.fileUrl))
        
        // Reset states and close modal
        setSelectedImage(null);
        setPreviewURL('');
        setShowAvatarModal(false);
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      alert("Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  // Cancel avatar update
  const handleCancelUpload = () => {
    setSelectedImage(null);
    setPreviewURL('');
    setShowAvatarModal(false);
  };

  const handleFieldEditToggle = (field) =>{
    if(field === 'phone'){
      setIsPhoneEdit(true);
      setTimeout(()=>{
        phoneInputRef.current.focus();
      },100)
    }
    else{
      setIsAddressEdit(true);
      setTimeout(()=>{
        addressInputRef.current.focus();
      },100)
    }
  }

  const handleUpdateUserPhone = async () =>{
    if(!phone) {
      setPhone('Not Set');
      return
    };
    try{
      const response = await axios.post('http://localhost:5000/api/user/update-user-detail',{userId:user.userId,phone});
      if(response.status === 200){
        dispatch(updateUserPhoneNumber(phone));
        setIsPhoneEdit(false);
        setPhone('')
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleUpdateUserAddress = async () =>{
    if(!address) {
      setAddress('Not Set');
      return
    };
    try{
      const response = await axios.post('http://localhost:5000/api/user/update-user-detail',{userId:user.userId,address});
      if(response.status === 200){
        dispatch(updateUserAddress(address));
        setIsAddressEdit(false);
        setAddress('')
      }
    }catch(err){
      console.log(err)
    }

  }

  useEffect(() => {
    setPhone(isPhoneEdit? user.phoneNumber || '':user.phoneNumber || 'Not Set');
    setAddress(isAddressEdit?user.address || '':user.address || 'Not Set');
  }, [user.phoneNumber, user.address,isPhoneEdit,isAddressEdit]);

  return (
    <div className={`flex flex-col items-center h-[calc(100vh-60px)] sm:h-screen`}>        
      <div className={`w-full px-5 py-3 flex items-center gap-3 border-b ${themeClasses.chatHeader}`}>
        <button onClick={()=>setCurrentSideBar('chatList')} className={`p-2 rounded-full ${darkMode?'hover:bg-gray-700':'hover:bg-gray-200'}`}><X size={24} /></button>
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <div className={`w-full h-full overflow-y-scroll custom-scrollbar ${themeClasses.chatArea}`}>

        <div className={`w-[95%] h-max mx-auto mt-10 p-5 flex flex-col items-start border border-gray-300 rounded-md ${themeClasses.chatHeader}`}>
          <div className="w-full flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-10">
            <div className="flex items-center justify-center relative w-48 h-48 p-1 bg-blue-100 rounded-full overflow-hidden">
              {imageError ? (
                <UserRound size={60} className="text-gray-600" />
              ) : (
                <img src={user.avatar} alt="" onError={()=>setImageError(true)} className="w-full h-full object-cover rounded-full" />
              )}
              <button 
                onClick={() => setShowAvatarModal(true)} 
                className="absolute w-full h-8 right-0 bottom-0 bg-black/50 flex justify-center items-center text-gray-200"
              >
                <Pencil size={20} />
              </button>
            </div>
            <div className="w-full flex-1">
              <h1 className="text-5xl font-semibold">{user.name}</h1>
              <div className="flex flex-col gap-1 text-md mt-3">
                <div className="flex items-center gap-2 pb-2"><Mail size={16} /> <input type="text" className="flex-1" value={user.email} disabled={true}/></div>
                <div className={`w-max flex items-center gap-2 pb-1 ${isPhoneEdit && 'border-b border-gray-500'} ${!user.phoneNumber && 'text-gray-600'}`}>
                  <Phone size={16} />
                  <input 
                    type="tel" 
                    ref={phoneInputRef} 
                    placeholder='Enter with country code' 
                    className={`flex-1 outline-0 placeholder:text-xs ${darkMode? isPhoneEdit && 'text-gray-300 placeholder:text-gray-600':isPhoneEdit && 'text-gray-700 placeholder:text-gray-400'}`} 
                    value={phone} 
                    onChange={(e)=>setPhone(e.target.value)} 
                    disabled={!isPhoneEdit}
                    />
                  {!isPhoneEdit && <button onClick={()=>handleFieldEditToggle('phone')} className='text-gray-500 p-2 rounded-full hover:bg-black/20'><Pencil size={14} /></button>}
                  {isPhoneEdit && <div className="flex items-center gap-2">
                    <button onClick={()=>{setIsPhoneEdit(false)}} className="text-red-500 p-2 rounded-full hover:bg-black/20"><X size={14} /></button>
                    <button onClick={handleUpdateUserPhone} className="text-blue-500 p-2 rounded-full hover:bg-black/20"><Check size={14} /></button>
                  </div> }
                </div>
                <div className={`w-max flex items-center gap-2 pb-1 ${isAddressEdit && 'border-b border-gray-500'} ${!user.address && 'text-gray-600'}`}>
                  <MapPinHouse size={16} />
                  <input 
                    type="tel" 
                    ref={addressInputRef} 
                    placeholder='Enter correct address' 
                    className={`flex-1 outline-0 placeholder:text-xs ${darkMode? isAddressEdit && 'text-gray-300 placeholder:text-gray-600':isAddressEdit && 'text-gray-700 placeholder:text-gray-400 '}`} 
                    value={address} 
                    onChange={(e)=>setAddress(e.target.value)} 
                    disabled={!isAddressEdit}
                    />
                  {!isAddressEdit && <button onClick={()=>handleFieldEditToggle('address')} className='text-gray-500 p-2 rounded-full hover:bg-black/20'><Pencil size={14} /></button>}
                  {isAddressEdit && <div className="flex items-center gap-2">
                    <button onClick={()=>{setIsAddressEdit(false)}} className="text-red-500 p-2 rounded-full hover:bg-black/20"><X size={14} /></button>
                    <button onClick={handleUpdateUserAddress} className="text-blue-500 p-2 rounded-full hover:bg-black/20"><Check size={14} /></button>
                  </div> }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`w-[95%] h-max mx-auto my-10 p-4 border border-gray-300 rounded-md ${themeClasses.chatHeader}`}>
          <div className="flex items-center gap-10">
            <button onClick={()=>setCurrentList('all')} className={`border-b-3 ${currentList==='all'?' border-blue-500 text-blue-500':'border-transparent'}`}>All Contacts</button>
            <button onClick={()=>setCurrentList('blocked')} className={`border-b-3 ${currentList==='blocked'?' border-blue-500 text-blue-500':'border-transparent'}`}>Blocked Contacts</button>
          </div>
          {(currentList==='all'?contactResult:user.blockedContacts).length>0 ? <div className="w-full h-[350px] overflow-y-scroll custom-scrollbar mt-10">
          {(currentList==='all'?contactResult:user.blockedContacts).map((contact) => (
            <div key={contact._id} className={`group w-full flex items-center justify-between p-4 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
                  <img src={contact.avatar} alt={contact.name.charAt(0).toUpperCase()} className='w-full h-full object-cover rounded-full'/>
                </div>
                <div className="ml-3 flex flex-col">
                  <span className="font-semibold text-base">{contact.name}</span>
                  <span className={`text-xs ${themeClasses.contactStatusText} `}>{contact.email}</span>
                </div>
              </div>
              {currentList==='all'?
                <div className={`relative`}>
                  <button onClick={() => setActiveContactId(prev => prev === contact._id ? null : contact._id)} className={`p-2 rounded-full ${darkMode ? `${activeContactId === contact._id && 'bg-gray-700 group-hover:bg-gray-800'} hover:bg-gray-800` : `${activeContactId === contact._id && 'bg-gray-200 group-hover:bg-gray-300'} hover:bg-gray-300`}`}><EllipsisVertical size={22} className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} /></button>
                  {activeContactId === contact._id && 
                    <div className={`absolute z-10 right-0 top-[100%] mt-2 px-2 py-2 flex flex-col ${themeClasses.chatHeader} shadow-md border rounded-md w-max`}>
                      <button className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-100'} rounded-md text-red-500`}><Trash2 size={18}/>Remove</button>
                      <button onClick={()=>handleBlockUser(contact)} className={`flex items-center gap-2 px-2 py-1 ${darkMode?'hover:bg-gray-700':'hover:bg-gray-100'} rounded-md `}>{checkBlocked(contact.userId) ?<><UserRoundCheck size={18}/>Unblock</> :<><UserRoundX size={18}/>Block</>} User</button>
                    </div>
                  }
                </div>
                :
                <button onClick={()=>handleBlockUser(contact)} className={`text-sm text-white bg-blue-500 px-2 py-1 rounded-lg `}>{checkBlocked(contact.userId)?'Unblock':'Block'}</button>
              }
            </div>
          ))}
          </div>:
          <div className="flex items-center justify-center h-[350px] mt-10">
            <span className="text-gray-500">{currentList==='all'?'No One in your contacts':'No blocked contacts'}</span>
          </div>
          }
        </div>
      </div>

      {/* Avatar Update Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className={`w-[90%] max-w-md p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
            <h2 className="text-xl font-semibold mb-4">Update Your Avatar</h2>
            
            <div className="mb-4">
              {previewURL ? (
                <div className="relative w-40 h-40 mx-auto">
                  <img src={previewURL} alt="Preview" className="w-full h-full object-cover rounded-full" />
                  <button 
                    onClick={() => {
                      setPreviewURL('');
                      setSelectedImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="relative flex flex-col items-center justify-center p-4 border-2 border-gray-500 border-dashed rounded-lg">
                  <Upload size={32} className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                  <p className="text-sm text-center">Click to select avatar image.</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute w-full h-full opacity-0 cursor-pointer"
                    ref={fileInputRef}
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <button 
                onClick={handleCancelUpload}
                className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleAvatarUpload}
                disabled={!selectedImage || uploading}
                className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 ${(!selectedImage || uploading) && 'opacity-50 cursor-not-allowed'}`}
              >
                {uploading ? 'Uploading...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile