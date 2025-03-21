import React, { useEffect, useRef, useState } from 'react'
import Logo from '../../assets/LOGO.png'
import person1 from '../../assets/try_1.jpg'
import person2 from '../../assets/try_2.jpg'
import { getThemeClasses } from '../../utils/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useChat } from '../../contexts/ChatContext';
import { Camera, CheckCircle, Mic, Phone, PhoneOff, Square, Video, X, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';


const CallLayout = () => {
    const {darkMode} = useTheme();
    const {currentStreamRef,peerStreamRef,CALL_STATUS,incomingCall,acceptCall,rejectCall} = useChat()
    const callStatus = useSelector(state => state.chat.callStatus)
    const themeClasses = getThemeClasses(darkMode);
    const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const callBox = useRef(null)

  // Set initial position to center of the screen
  useEffect(() => {
    if(callBox.current){
        const { width, height } = callBox.current.getBoundingClientRect();
        const centerX = window.innerWidth / 2 - width / 2;
        const centerY = window.innerHeight / 2 - height / 2;
    setPosition({ x: centerX, y: centerY });
    }
  }, []);

  const startDrag = (e) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const stopDrag = () => {
    setDragging(false);
  };


  // Create dedicated refs for the video elements
const localVideoRef = useRef(null);
const remoteVideoRef = useRef(null);

// Then in a useEffect, update the srcObject when streams change
useEffect(() => {
  if (localVideoRef.current && currentStreamRef.current) {
    localVideoRef.current.srcObject = currentStreamRef.current;
  }
  
  if (remoteVideoRef.current && peerStreamRef.current) {
    remoteVideoRef.current.srcObject = peerStreamRef.current;
  }
}, [currentStreamRef.current, peerStreamRef.current]);

  return (
  
    <div className="">

    {incomingCall && callStatus === CALL_STATUS.RINGING &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${themeClasses.callBody} p-6 rounded-lg shadow-lg w-[400px]`}>
              <div className="flex flex-col items-center">
                  <img src={Logo} alt="logo" className="w-16 h-16 mb-4" />
                  <h3 className="text-xl font-bold mb-2">Incoming Call</h3>
                  {/* <p className="text-lg mb-6">{callerInfo?.name}</p> */}
                  
                  <div className="flex justify-center gap-8 w-full">
                      <button 
                          onClick={rejectCall}
                          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                      >
                          <XCircle size={20} />
                          Decline
                      </button>
                      <button 
                          onClick={acceptCall}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                      >
                          <CheckCircle size={20} />
                          Accept
                      </button>
                  </div>
              </div>
          </div>
      </div>
    } 




    {callStatus === CALL_STATUS.ONGOING && <div className="pointer-events-none fixed z-10 w-full h-full mx-auto" onMouseMove={onDrag} onMouseUp={stopDrag}>
      <div ref={callBox} className=" text-white rounded-lg custom-shadow  w-[800px]"style={{ position: "absolute", top: position.y, left: position.x }} >
            <div className={`flex items-center justify-between w-full px-4 py-2 cursor-move ${themeClasses.callHeader} rounded-tl-lg rounded-tr-lg pointer-events-auto`} onMouseDown={startDrag}>
                <div className="w-7 h-7"><img src={Logo} alt="asd" className='w-full h-full'/></div>
                <div className="">Anish Gupta</div>
                <div className="flex items-center gap-3">
                    <button onMouseDown={(e) => e.stopPropagation()} className='p-1'><Square size={14}/></button>
                    <button onMouseDown={(e) => e.stopPropagation()} className='p-1'><X size={18}/></button>
                </div>
            </div>
            <div className={`relative w-full h-[450px] ${themeClasses.callBody} rounded-bl-lg rounded-br-lg`}>
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className=" w-[90%] h-[85%] rounded-lg">
                      {/* <img src={person1} alt="" className='w-full h-full object-cover rounded-lg'/> */}
                      <video 
                      autoPlay
                      ref={remoteVideoRef}/>
                    </div>
                    <div className=" absolute top-3 right-3  w-[25%] h-[30%] rounded-lg">
                      {/* <img src={person2} alt="" className='w-full h-full object-cover rounded-lg'/> */}
                      <video 
                      autoPlay
                      ref={ localVideoRef}/>
                    </div>
                </div>
                <div className="absolute bottom-2 w-full flex justify-center pointer-events-auto">
                    <div className='bg-[rgba(0,0,0,0.5)] w-max flex items-center gap-3 px-2 py-1 rounded-lg'>
                        <button className='p-2 hover:bg-[rgba(0,0,0,0.3)] rounded-full' onClick={()=>console.log('mic')}><Mic size={20}/></button>
                        <button className='p-2 hover:bg-[rgba(0,0,0,0.3)] rounded-full'><Video size={20}/></button>
                        <button className='bg-red-500 rounded-xl px-2 py-1'><Phone size={20} className='rotate-[135deg]'/></button>
                    </div>
                </div>
            </div>
      </div>
    </div>}

    </div>
  )
}

export default CallLayout