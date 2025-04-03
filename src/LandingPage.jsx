import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { MessageCircle, Phone, Star, Settings, SunMoon, Sun, Moon, X } from 'lucide-react';
import Logo from './assets/LOGO.png';
import GooleIcon from './assets/google.png';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/user/userSlice';
import {useTheme} from './contexts/ThemeContext';

const LandingPage = () => {
  const {darkMode,toggleTheme} = useTheme()
  const [loginPopup, setLoginPopup] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const themeClasses = {
    container: darkMode ? 'bg-gray-900 text-white' : 'bg-[#f8faff] text-gray-700',
    navbar: darkMode ? 'bg-gray-800' : 'bg-blue-600',
    box: darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200',
    themeIcon: darkMode ? 'text-yellow-300 bg-gray-700' : 'text-white bg-blue-500',
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/google-login',
          { access_token: tokenResponse.access_token },
          { withCredentials: true }
        );
        
        console.log('Login Success:', response.data.user);
        // setUser(response.data.user);
        const data = response.data.user;
        dispatch(setUser
                ({
                  userId: data.userId,
                  name: data.name,
                  email: data.email,
                  avatar: data.avatar,
                  isAuthenticated: true,
                })
              );
        navigate('/chat');
      } catch (error) {
        console.error('Google login error:', error);
      }
    },
    onError: (error) => console.log('Login Failed:', error)
  });


  return (
    <div className={`min-h-screen ${themeClasses.container} flex flex-col items-center ${loginPopup ? 'overflow-hidden' : ''}`}>
      <header className={`h-16 mt-6 p-4 md:p-8 flex justify-between items-center w-[90%] md:max-w-6xl rounded-4xl ${themeClasses.navbar}`}>
        <div className="flex items-center space-x-3">
          <img src={Logo} alt="DuoChat Logo" className="w-8 h-8 md:w-10 md:h-10" />
          <h1 className="text-xl md:text-3xl font-bold text-white">DuoChat</h1>
        </div>
        <nav className="space-x-6 flex items-center">
          {/* <Link to='/signup' className={`hidden md:flex flex items-center ${darkMode?'text-gray-300 hover:text-white':'text-white'} px-4 py-1 font-semibold`}>Sign Up</Link> */}
          <button onClick={googleLogin} className={`hidden md:flex items-center gap-1 text-gray-800 bg-white px-4 py-2 rounded-4xl font-semibold`}> <img src={GooleIcon} alt="G" className='w-5 h-5' /> Sign In</button>
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${themeClasses.themeIcon}`}>
                {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
        </nav>
      </header>
      
      <main className='w-full h-full my-15 flex flex-col items-center justify-center'>
      <section className="flex flex-col items-center justify-center text-center px-6 mt-20">
        <h2 className="text-5xl font-bold mb-4">Fast, Secure & Intuitive Messaging</h2>
        <p className="text-gray-400 max-w-2xl mb-6">
          Connect with friends and colleagues instantly using DuoChat. Experience real-time chat, seamless UI, and powerful features, all in one place.
        </p>
        <div className="flex flex-wrap justify-center gap-5 mt-10">
            {/* <Link to='/signup' className={`flex md:hidden ${darkMode?'border-2 border-white':'border-2 border-blue-600 text-blue-600'} px-6 py-2 rounded-4xl font-semibold`}>Sign Up</Link> */}
            <button onClick={googleLogin} className={`flex md:hidden items-center gap-1 text-gray-800 bg-white px-4 py-2 rounded-4xl font-semibold`}> <img src={GooleIcon} alt="G" className='w-5 h-5' /> Sign In</button>
            <button onClick={()=>setLoginPopup(true)} className="bg-blue-600 px-6 py-2 text-white rounded-4xl text-lg font-semibold ">Start Chatting</button>
        </div>
      </section>
      
      <section className="mt-30 w-full px-6 max-w-6xl">
        <div className="w-full flex justify-center"><h3 className="text-3xl font-semibold mb-8 border-b-3 w-max">Features</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className={`p-6 ${themeClasses.box} rounded-lg`}>
            <MessageCircle size={32} className="mx-auto mb-4 text-blue-500" />
            <h4 className="text-xl font-semibold">Instant Messaging</h4>
            <p className="text-gray-400">Real-time chat with a clean and user-friendly interface.</p>
          </div>
          <div className={`p-6 ${themeClasses.box} rounded-lg`}>
            <Phone size={32} className="mx-auto mb-4 text-green-500" />
            <h4 className="text-xl font-semibold">Voice & Video Calls</h4>
            <p className="text-gray-400">Seamless voice and video calling for better communication.</p>
          </div>
          <div className={`p-6 ${themeClasses.box} rounded-lg`}>
            <Star size={32} className="mx-auto mb-4 text-yellow-500" />
            <h4 className="text-xl font-semibold">Starred Chats</h4>
            <p className="text-gray-400">Star and keep your most important chats separate.</p>
          </div>
          <div className={`p-6 ${themeClasses.box} rounded-lg`}>
            <SunMoon size={32} className="mx-auto mb-4 text-red-500" />
            <h4 className="text-xl font-semibold">Customizable Theme</h4>
            <p className="text-gray-400">Light and dark mode options for better user experience.</p>
          </div>
        </div>
      </section>
      </main>

      {loginPopup &&
      <div className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
          <div className={`${themeClasses.loginPopup} rounded-lg shadow-lg w-[95%] sm:w-[400px] bg-white text-gray-800`}>
              <div className="flex items-center justify-between p-5 border-b border-gray-300">
                  <div className="flex gap-3 items-center">
                    <img src={GooleIcon} alt="G" className='w-6 h-6'/>
                    <span className="">Sign in with Google</span>
                  </div>
                  <button className="text-gray-700 hover:bg-black/5 p-1 rounded-full" onClick={()=>setLoginPopup(false)}><X size={20} /></button>
              </div>
              <div className="p-5">
                <h1 className="text-xl md:text-[28px] font-semibold">Use your Google Account to sign in to DuoChat</h1>
                <div className="flex items-center">
                  <p className="flex-1 text-[14px] md:text-[16px]">No more passwords to remember. Signing in is fast, simple and secure.</p>
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 p-3 rounded-full"><img src={Logo} alt="DuoChat" className="w-full h-full" /></div>
                </div>
                <button onClick={googleLogin} className={`w-full mt-6 flex justify-center bg-blue-600 text-white px-4 py-2 rounded-4xl font-semibold`}>Continue</button>
              </div>
          </div>
      </div>
    } 
    </div>
  );
};

export default LandingPage;
