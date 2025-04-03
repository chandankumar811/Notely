import React, { useEffect, useRef, useState } from 'react'
import Logo from '../../assets/LOGO.png'
import person1 from '../../assets/try_1.jpg'
import person2 from '../../assets/try_2.jpg'
import callerRingtone from '../../assets/callerRingtone.mp3'
import receiverRingtone from '../../assets/receiverRingtone.mp3'
import { getThemeClasses } from '../../utils/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useChat } from '../../contexts/ChatContext';
import { Camera, CheckCircle, Maximize2, Mic, MicOff, Minimize2, Phone, PhoneOff, Square, Video, VideoOff, X, XCircle } from 'lucide-react';
import { useSelector,useDispatch } from 'react-redux';
import { setCallStatus } from '../../redux/slices/chat/chatSlice';


const CallLayout = () => {
    const {darkMode} = useTheme();
    const {socket,
        micStatus,
        peerMicStatus,
        peerVideoStatus,
        videoStatus,
        setMicStatus,
        setVideoStatus,
        caller,
        callType,
        currentStreamRef,
        peerStreamRef,
        CALL_STATUS,
        incomingCall,
        initiateCall,
        acceptCall,
        rejectCall,
        cancelCall,
        hangupCall,
        localVideoRef,
        remoteVideoRef,
        isCallTimeoutDialogOpen,
        setIsCallTimeoutDialogOpen
    } = useChat()
    const user = useSelector(state => state.user)
    const callStatus = useSelector(state => state.chat.callStatus)
    const selectedChat = useSelector(state => state.chat.selectedChat)
    const selectedCallReceiver = useSelector(state => state.chat.selectedCallReceiver)
    const themeClasses = getThemeClasses(darkMode);
  const [windowMode, setWindowMode] = useState('normal');
  // Responsive design breakpoints
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dispatch = useDispatch();
  // New dialog states
  const [isRejectedDialogOpen, setIsRejectedDialogOpen] = useState(false);
  const [isCancelledDialogOpen, setIsCancelledDialogOpen] = useState(false);
  const [isCallEndedDialogOpen, setIsCallEndedDialogOpen] = useState(false);
  


  // Ringtone refs
  const callerRingtoneRef = useRef(new Audio(callerRingtone));
  const receiverRingtoneRef = useRef(new Audio(receiverRingtone));

  // Ringtone control
//   const [isRinging, setIsRinging] = useState(false);

  // Manage ringtones based on call status
  useEffect(() => {
      if (callStatus === CALL_STATUS.RINGING) {
        setIsRejectedDialogOpen(false)
        setIsCallEndedDialogOpen(false)
          if (incomingCall) {
              // Receiver side ringtone
              receiverRingtoneRef.current.loop = true;
              receiverRingtoneRef.current.play();
            //   setIsRinging(true);
          } else {
              // Caller side ringtone
              callerRingtoneRef.current.loop = true;
              callerRingtoneRef.current.play();
            //   setIsRinging(true);
          }
      } else {
          // Stop ringtones when call is no longer ringing
          callerRingtoneRef.current.pause();
          callerRingtoneRef.current.currentTime = 0;
          receiverRingtoneRef.current.pause();
          receiverRingtoneRef.current.currentTime = 0;
        //   setIsRinging(false);
      }

      // Manage dialog states
      if (callStatus === CALL_STATUS.REJECTED) {
        setIsRejectedDialogOpen(true);
    }

    if (callStatus === CALL_STATUS.CANCELLED) {
        setIsCancelledDialogOpen(true);
    }

    if (callStatus === CALL_STATUS.ENDED) {
        setIsCallEndedDialogOpen(true);
    }
    console.log(callStatus)
      // Cleanup function to stop ringtones
      return () => {
          callerRingtoneRef.current.pause();
          receiverRingtoneRef.current.pause();
      };
  }, [callStatus, incomingCall]);



  useEffect(() => { 
    if(callStatus===CALL_STATUS.RINGING && localVideoRef.current && currentStreamRef.current){
      console.log(currentStreamRef.current)
      localVideoRef.current.srcObject = currentStreamRef.current
    }  
  }, [callStatus,currentStreamRef.current]);

// Toggle mic and video status
const toggleMic = () => {
  if (currentStreamRef.current) {
    currentStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !micStatus;  // Toggle the track
    });
}

setMicStatus(prev => !prev);

  socket.emit('update-media-status', {
      receiverId: user.userId===caller.userId ? selectedCallReceiver.userId : caller.userId, 
      micStatus: !micStatus,
      videoStatus: videoStatus 
  });
};

const toggleVideo = () => {
  if (currentStreamRef.current) {
    currentStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !videoStatus;  // Toggle the track
    });
}

  setVideoStatus(prev => !prev);

  socket.emit('update-media-status', { 
      receiverId: user.userId===caller.userId ? selectedCallReceiver.userId : caller.userId,
      micStatus: micStatus,
      videoStatus: !videoStatus 
  });
};

  // Close dialog handlers
  const handleCloseRejectedDialog = () => {
    setIsRejectedDialogOpen(false);
    dispatch(setCallStatus(CALL_STATUS.IDLE))
    console.log(selectedCallReceiver)
};

const handleCloseCancelledDialog = () => {
    setIsCancelledDialogOpen(false);
    dispatch(setCallStatus(CALL_STATUS.IDLE))
};

const handleCloseCallEndedDialog = () => {
    setIsCallEndedDialogOpen(false);
    dispatch(setCallStatus(CALL_STATUS.IDLE))
};





// Resize listener
useEffect(() => {
    const handleResize = () => {
        const mobile = window.innerWidth <= 768;
        setIsMobile(mobile);

        // Always maximize on mobile
        if (mobile) {
            setWindowMode('normal');
        } 
        // else {
        //     // Reset to normal on desktop if currently in mobile mode
        //     setWindowMode('normal');
        // }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

// Toggle window mode
const toggleWindowMode = () => {
    // if (!isMobile) {
        // On desktop, toggle between normal and maximized
        setWindowMode(prev => prev === 'normal' ? 'minimized' : 'normal');
    // }
};

// Responsive window styles
const getWindowStyles = () => {
    
    if(isMobile){
        if(windowMode === 'normal'){
            return {
                width: '100%',
                height: 'calc(100% - 40px)',
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex:50
            };
        }
        else{
            return{
                width: '160px',
                height:'160px',
                position: 'absolute',
                top: 65,
                right: 10,
                zIndex: 50
            }
        }
    }
    else {
        if(windowMode === 'normal'){
        return {
            width: '50%',
            aspectRatio:'16/9',
            position: 'absolute',
            top:'50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50
        }
        }
        else{
            return{
                width: '300px',
                position: 'absolute',
                top: 15,
                right: 15,
                zIndex: 50
            }
        }
    }
    

};
// Render call window
if (callStatus === CALL_STATUS.ONGOING) {
    return (
        <div className={`w-full h-full`} >
            <div 
                className="absolute z-20 text-white rounded-lg custom-shadow " 
                style={getWindowStyles()}
            >
                {/* Call Header */}
                <div 
                    className={`flex items-center justify-between w-full px-4 py-2 ${themeClasses.callHeader} rounded-tl-lg rounded-tr-lg pointer-events-auto`} >
                    <div className={`${isMobile? 'w-5 h-5':'w-7 h-7'}`}>
                        <img src={Logo} alt="logo" className='w-full h-full'/>
                    </div>
                    <div className={`${isMobile?'text-xs':'text-lg'}`}>{caller?.name || selectedCallReceiver?.name}</div>
                    <div className="flex items-center gap-3">
                        {/* {!isMobile && ( */}
                            <button 
                                onMouseDown={(e) => e.stopPropagation()} 
                                onClick={toggleWindowMode} 
                                className='p-1'
                            >
                                {windowMode === 'normal' ? <Minimize2 size={16}/> : <Maximize2 size={16}/>}
                            </button>
                        {/* )} */}
                    </div>
                </div>

                {/* Call Body */}
                <div 
                    className={`relative w-full h-full ${themeClasses.callBody} rounded-bl-lg rounded-br-lg overflow-hidden`}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Remote Video */}
                        <div className="w-full h-full rounded-lg">
                            <video 
                                autoPlay
                                playsInline
                                ref={remoteVideoRef}
                                className="w-full h-full object-cover"
                            />
                            {!peerMicStatus && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-5 rounded-full bg-black/30 text-red-400"><MicOff size={20} /></div>}
                            {!peerVideoStatus && <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-700"><img src={caller.avatar} alt="" className='rounded-full w-1/5 aspect-square'/></div>}
                        </div>

                        {/* Local Video (Picture-in-Picture) */}
                        <div className={`
                            absolute overflow-hidden
                            ${windowMode === 'maximized' 
                                ? 'top-4 right-4 w-1/4 h-1/4' 
                                : 'top-3 right-3 w-[25%] h-[30%]'} 
                            rounded-lg`}
                        >
                            <video 
                                autoPlay
                                playsInline
                                muted
                                ref={localVideoRef}
                                className="w-full h-full object-cover rounded-lg"
                            />
                            {!videoStatus && <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-gray-600"><img src={user.avatar} alt="" className='rounded-full w-1/4 aspect-square'/></div>}
                        </div>
                    </div>

                    {/* Call Controls */}
                    {windowMode==='normal' && <div className="absolute bottom-2 w-full flex justify-center pointer-events-auto">
                        <div className={`bg-[rgba(0,0,0,0.5)] w-max flex items-center gap-3 px-2 py-1 rounded-lg `}>
                            <button 
                                className='p-2 hover:bg-[rgba(0,0,0,0.3)] rounded-full' 
                                onClick={toggleMic}
                            >
                                {micStatus ? <Mic size={20}/> : <MicOff size={20}/>}
                            </button>
                            <button 
                                className='p-2 hover:bg-[rgba(0,0,0,0.3)] rounded-full' 
                                onClick={toggleVideo}
                            >
                                {videoStatus ? <Video size={20}/> : <VideoOff size={20}/>}
                            </button>
                            <button 
                                className='bg-red-500 rounded-xl px-2 py-1' 
                                onClick={hangupCall}
                            >
                                <Phone size={20} className='rotate-[135deg]'/>
                            </button>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
}




  return (
  
    <div className="">

    {incomingCall && callStatus === CALL_STATUS.RINGING &&
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
          <div className={`${themeClasses.callBody} p-6 rounded-lg shadow-lg w-[400px]`}>
              <div className="flex flex-col items-center">
              <img src={Logo} alt="logo" className={`w-16 h-16 mb-4 rounded-full p-1 ${darkMode?'bg-transparent':'bg-blue-600'}`} />
                  <h3 className="text-md mb-3">Incoming {callType} Call from <span className='font-bold'>{caller?.name}</span></h3>
                  
                  <div className={`w-full ${callType==='video'? 'h-[200px]':'h-4'} rounded-md mb-5`}>
                      <video 
                      autoPlay
                      playsInline
                      muted
                      ref={localVideoRef}
                      className='w-full h-full object-cover rounded-md'
                      />
                    </div>
                  
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



    {/* Caller Side Window */}
    {!incomingCall && callStatus === CALL_STATUS.RINGING &&
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
                    <div className={`${themeClasses.callBody} p-6 rounded-lg shadow-lg w-[400px]`}>
                        <div className="flex flex-col items-center">
                        <img src={Logo} alt="logo" className={`w-16 h-16 mb-4 rounded-full p-1 ${darkMode?'bg-transparent':'bg-blue-600'}`} />
                            <h3 className="text-md mb-3">Calling {selectedCallReceiver?.name}</h3>

                            <div className={`w-full ${callType==='video'? 'h-[200px]':'h-4'} rounded-md mb-5`}>
                                <video 
                                    autoPlay
                                    playsInline
                                    muted
                                    ref={localVideoRef}
                                    className='w-full h-full object-cover rounded-md'
                                />
                            </div>
                            
                            <div className="flex justify-center gap-8 w-full">
                                <button 
                                    onClick={cancelCall}
                                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                                >
                                    <PhoneOff size={20} />
                                    Cancel Call
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }




    {/* {callStatus === CALL_STATUS.ONGOING && <div className="pointer-events-none fixed z-10 w-full h-full mx-auto" onMouseMove={onDrag} onMouseUp={stopDrag}>
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
                    {<div className=" w-[90%] h-[85%] rounded-lg">
                      <video 
                      autoPlay
                      playsInline
                      ref={remoteVideoRef}/>
                    </div>}
                    {<div className=" absolute top-3 right-3  w-[25%] h-[30%] rounded-lg">
                      <video 
                      autoPlay
                      playsInline
                      muted
                      ref={ localVideoRef}/>
                    </div>}
                </div>
                <div className="absolute bottom-2 w-full flex justify-center pointer-events-auto">
                    <div className='bg-[rgba(0,0,0,0.5)] w-max flex items-center gap-3 px-2 py-1 rounded-lg'>
                        <button className='p-2 hover:bg-[rgba(0,0,0,0.3)] rounded-full' onClick={toggleMic}>{micStatus?<Mic size={20}/>:<MicOff size={20}/>}</button>
                        <button className='p-2 hover:bg-[rgba(0,0,0,0.3)] rounded-full' onClick={toggleVideo}>{videoStatus ? <Video size={20}/>: <VideoOff size={20}/>}</button>
                        <button className='bg-red-500 rounded-xl px-2 py-1' onClick={hangupCall}><Phone size={20} className='rotate-[135deg]'/></button>
                    </div>
                </div>
            </div>
      </div>
    </div>} */}

    {isRejectedDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
                    <div className={`${themeClasses.callBody} p-6 rounded-lg shadow-lg w-[400px]`}>
                        <div className="flex flex-col items-center">
                            <img src={Logo} alt="logo" className={`w-16 h-16 mb-4 rounded-full p-1 ${darkMode?'bg-transparent':'bg-blue-600'}`} />
                            <h3 className="text-lg font-bold mb-4">Call Rejected</h3>
                            <p className="text-md mb-6">
                                {selectedCallReceiver?.name} has declined your call.
                            </p>
                            <button 
                                onClick={handleCloseRejectedDialog}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Dialog for Call Cancellation (Receiver Side) */}
            {/* {isCancelledDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className={`${themeClasses.callBody} p-6 rounded-lg shadow-lg w-[400px]`}>
                        <div className="flex flex-col items-center">
                            <img src={Logo} alt="logo" className="w-16 h-16 mb-4" />
                            <h3 className="text-lg font-bold mb-4">Call Cancelled</h3>
                            <p className="text-md mb-6">
                                {caller?.name} has cancelled the incoming call.
                            </p>
                            <button 
                                onClick={handleCloseCancelledDialog}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {/* Custom Dialog for Call Ended */}
            {isCallEndedDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
                    <div className={`${themeClasses.callBody} p-6 rounded-lg shadow-lg w-[400px]`}>
                        <div className="flex flex-col items-center">
                            <img src={Logo} alt="logo" className={`w-16 h-16 mb-4 rounded-full p-1 ${darkMode?'bg-transparent':'bg-blue-600'}`} />
                            <h3 className="text-lg font-bold mb-4">Call Ended</h3>
                            <p className="text-md mb-6">
                                Your call with {selectedCallReceiver?.name || caller?.name} has ended.
                            </p>
                            <button 
                                onClick={handleCloseCallEndedDialog}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Dialog for Call Ended */}
            {isCallTimeoutDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.8)]">
                    <div className={`${themeClasses.callBody} p-6 rounded-lg shadow-lg w-[400px]`}>
                        <div className="flex flex-col items-center">
                            <img src={Logo} alt="logo" className={`w-16 h-16 mb-4 rounded-full p-1 ${darkMode?'bg-transparent':'bg-blue-600'}`} />
                            <h3 className="text-lg font-bold mb-4">Not Answered</h3>
                            <p className="text-md mb-6">
                                {selectedCallReceiver?.name} didn't answer the call
                            </p>
                            <div className="flex items-center gap-4">
                            <button 
                                onClick={()=>setIsCallTimeoutDialogOpen(false)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                            >
                                Close
                            </button>
                            <button 
                                onClick={()=>initiateCall(callType)}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                            >
                                {callType === 'audio' ? <Phone size={20} /> : <Video size={20} />}
                                Call Again
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

    </div>
  )
}

export default CallLayout