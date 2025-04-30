import React, { useState } from "react";
import Logo from "./assets/notely-logo.png";
import GoogleIcon from "./assets/google.png";
import { useTheme } from "./contexts/ThemeContext.jsx";
import {
  MessageCircle,
  Phone,
  Star,
  Settings,
  SunMoon,
  Sun,
  Moon,
  X,
  NotebookPen,
} from "lucide-react";

const LandingPage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [loginPopup, setLoginPopup] = useState();

  const themeClasses = {
    container: darkMode
      ? "bg-gray-900 text-white"
      : "bg-[#f8faff] text-gray-700",
    navbar: darkMode ? "bg-gray-800" : "bg-blue-600",
    box: darkMode ? "bg-gray-800" : "bg-white border border-gray-200",
    themeIcon: darkMode
      ? "text-yellow-300 bg-gray-700"
      : "text-white bg-blue-500",
  };
  return (
    <div
      className={`min-h-screen ${
        themeClasses.container
      } flex flex-col items-center ${loginPopup ? "overflow-hidden" : ""}`}
    >
      <header
        className={`h-16 mt-6 md:p-8 flex justify-between items-center w-[90%] md:max-w-6xl rounded-4xl ${themeClasses.navbar}`}
      >
        <div className="flex items-center">
          <img src={Logo} alt="" className="h-28" />
          {/* <h1>Chandan</h1> */}
        </div>
        <nav className="space-x-6 flex items-center mr-4 md:mr-0">
          <button
            className={`hidden md:flex items-center gap-1 text-gray-800 bg-white px-4 py-2 rounded-4xl font-semibold`}
          >
            <img src={GoogleIcon} alt="G" className="w-5 h-5" />
            Sign in
          </button>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${themeClasses.themeIcon}`}
          >
            {darkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </nav>
      </header>
      <main className="w-full h-full my-15 flex flex-col items-center justify-center">
        <section className="flex flex-col items-center justify-center text-center px-6 mt-20">
          <h2 className="text-5xl font-bold mb-4">
            Fast, Secure Messaging & Note Taking
          </h2>
          <p className="text-gray-400 max-w-2xl mb-6">
            Connect instantly with friends and colleagues through real-time
            chat, while keeping your thoughts organized with built-in
            note-taking. A seamless, all-in-one platform designed for smarter
            conversations and productivity.
          </p>
          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <button
              className={`flex md:hidden items-center gap-1 text-gray-800 bg-white px-4 py-2 rounded-4xl font-semibold`}
            >
              {" "}
              <img src={GoogleIcon} alt="G" className="w-5 h-5" /> Sign In
            </button>
            <button
              onClick={() => setLoginPopup(true)}
              className="bg-blue-600 px-6 py-2 text-white rounded-4xl text-lg font-semibold "
            >
              Start Chatting
            </button>
          </div>
        </section>

        <section className="mt-30 w-full px-6 max-w-6xl">
          <div className="w-full flex justify-center">
            <h3 className="text-3xl font-semibold mb-8 border-b-3 w-max">
              Features
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className={`p-6 ${themeClasses.box} rounded-lg`}>
              <MessageCircle size={32} className="mx-auto mb-4 text-blue-500" />
              <h4 className="text-xl font-semibold">Instant Messaging</h4>
              <p className="text-gray-400">
                Chat in real-time with friends, teammates, or colleagues — fast,
                secure, and seamless.
              </p>
            </div>
            <div className={`p-6 ${themeClasses.box} rounded-lg`}>
              <Phone size={32} className="mx-auto mb-4 text-green-500" />
              <h4 className="text-xl font-semibold">Voice & Video Calls</h4>
              <p className="text-gray-400">
                Connect face-to-face with crystal-clear voice and video calls —
                anytime, anywhere.
              </p>
            </div>
            <div className={`p-6 ${themeClasses.box} rounded-lg`}>
              <NotebookPen size={32} className="mx-auto mb-4 text-yellow-500" />
              <h4 className="text-xl font-semibold">Starred Chats</h4>
              <p className="text-gray-400">
                Create and share notes with your team — stay organized, aligned,
                and productive together.
              </p>
            </div>
            <div className={`p-6 ${themeClasses.box} rounded-lg`}>
              <SunMoon size={32} className="mx-auto mb-4 text-red-500" />
              <h4 className="text-xl font-semibold">Customizable Theme</h4>
              <p className="text-gray-400">
                Light and dark mode options for better user experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      {loginPopup && (
        <div className="fixed w-full h-full inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
          <div
            className={`${themeClasses.loginPopup} rounded-lg shadow-lg w-[95%] sm:w-[400px] bg-white text-gray-800`}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-300">
              <div className="flex gap-3 items-center">
                <img src={GoogleIcon} alt="G" className="w-6 h-6" />
                <span className="">Sign in with Google</span>
              </div>
              <button
                className="text-gray-700 hover:bg-black/5 p-1 rounded-full"
                onClick={() => setLoginPopup(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-5">
              <h1 className="text-xl md:text-[28px] font-semibold">
                Use your Google Account to sign in to DuoChat
              </h1>
              <div className="flex items-center">
                <p className="flex-1 text-[14px] md:text-[16px]">
                  No more passwords to remember. Signing in is fast, simple and
                  secure.
                </p>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-500 p-3 rounded-full">
                  <img src={Logo} alt="Notely" className="w-full h-full" />
                </div>
              </div>
              <button
                className={`w-full mt-6 flex justify-center bg-blue-600 text-white px-4 py-2 rounded-4xl font-semibold`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
