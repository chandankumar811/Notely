import React, { createContext, useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addMessage, setCallStatus, setSelectedCallReceiver } from '../redux/slices/chat/chatSlice';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import { setBlockedContacts, updateBlockedContacts } from '../redux/slices/user/userSlice';

const ChatContext = createContext();
const getSocket = () => {
  return io("http://localhost:5000");
};

const CALL_STATUS = {
  IDLE:'idle',
  RINGING:'ringing',
  ONGOING:'ongoing',
  REJECTED:'rejected',
  CANCELLED:'cancelled',
  ENDED:'ended'
}

export const ChatProvider = ({ children }) => {

  const dispatch = useDispatch();
  
  const selectedChat = useSelector(state => state.chat.selectedChat)
  const selectedCallReceiver = useSelector(state => state.chat.selectedCallReceiver)
  const callStatus = useSelector(state => state.chat.callStatus)
  const chatList = useSelector(state => state.chat.chatList)
  const user = useSelector(state => state.user)
  
  const socket = useMemo(() => getSocket(), []);

  // call states
  const [micStatus,setMicStatus] = useState(true);
  const [videoStatus,setVideoStatus] = useState(true);
  const peerInstance = useRef(null)
  const currentStreamRef = useRef(null)

  const peerStreamRef = useRef(null)
  const currentCallRef = useRef(null)
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerMicStatus,setPeerMicStatus] = useState(true);
  const [peerVideoStatus,setPeerVideoStatus] = useState(true);
  // const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);

  const [callDuration,setCallDuration] = useState(0) 
  const [caller,setCaller] = useState(null);
  const [callStartTime,setCallStartTime] = useState(null)
  const [callType,setCallType] = useState('')
  const [ringtonePlaying,setRingtonePlaying] = useState(false)
  const [incomingCall,setIncomingCall] = useState(false)
  // const [incomingCallType,setIncomingCallType] = useState('')
  const callTimeoutRef = useRef(null);
  const callDurationIntervalRef = useRef(null);
  const CALL_TIMEOUT_DURATION = 30000;
  const [isCallTimeoutDialogOpen, setIsCallTimeoutDialogOpen] = useState(false);


  useEffect(()=>{
    const fetchBlockedContacts = async () =>{
      try {
        const response = await axios.get(`http://localhost:5000/api/contact/fetch-blocked/${user.userId}`);
        if(response.status===200){
          console.log(response.data.blockedContacts)
          dispatch(setBlockedContacts(response.data.blockedContacts))
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    if(user.userId){
      fetchBlockedContacts();
    }
  },[user.userId])

  const checkIsBlocked = async (userId) =>{
    try {
      const response = await axios.get(`http://localhost:5000/api/contact/check-blocked/${user.userId}/${userId}`);
      if(response.status === 200){
        return response.data.isBlocked;
      }
    } catch (error) {
      console.log(error)
    }
  }

  
    const sendMessage = async (message,attachment,messageType) =>{
      // const isBlocked = await checkIsBlocked(selectedChat.userId);
      //   if(isBlocked){
      //     return isBlocked
      //   }
        try{
          const response = await axios.post('http://localhost:5000/api/chat/send-message',{
            senderId:user.userId,
            receiverId:selectedChat.userId,
            message,
            attachment,
            messageType
          });
          if(response.status === 200){
            dispatch(addMessage({peerId:selectedChat.userId,message:response.data.message,lastMessage:response.data.lastMessage}));
            socket.emit('new-message',{senderId:user.userId,receiverId:selectedChat.userId,message:response.data.message,lastMessage:response.data.lastMessage})
          }
        }catch(err){

        }
    }

    const setupMediaStream = async (callType) => {
      try {
        const mediaConstraints = {
          video: callType === "video" && videoStatus,
          audio: micStatus,
        };

        const stream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints
        );
        currentStreamRef.current = stream;
        return stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Could not access camera and microphone');
        return null;
      }
    };

    const handleAddPeerStream = (stream,micStatus,videoStatus) =>{
      peerStreamRef.current = stream;
      setPeerMicStatus(micStatus);
      setPeerVideoStatus(videoStatus)
    }

    const updateCallStatus = (status) =>{
      dispatch(setCallStatus(status));
    }



    const initiateCall = async (receiver,callType) => {

      setIsCallTimeoutDialogOpen(false)
      console.log(receiver)
      dispatch(setSelectedCallReceiver({
        userId:receiver.userId,
        name:receiver.name,
        avatar:receiver.avatar
      }))

      if (callStatus !== CALL_STATUS.IDLE) {
        // console.log('Cannot initiate call: already in a call state');
        return;
      }
      
      const stream = await setupMediaStream(callType);
      if (!receiver.userId || !peerInstance.current || !currentStreamRef.current) return;

      if (receiver.userId) {
          const call = peerInstance.current.call(receiver.userId, currentStreamRef.current,{
            metadata: {
              name:user.name,
              avatar:user.avatar,
              callType,
              micStatus,
              videoStatus
            }
          });
          if(call) {
            console.log('calling')
            updateCallStatus(CALL_STATUS.RINGING);
            setCallType(callType)
            setCaller({
              userId:user.userId,
              name:user.name,
              avatar:user.avatar
            })
                 
            callTimeoutRef.current = setTimeout(() => {
              if (callStatus !== CALL_STATUS.ONGOING) {
                socket.emit('timeout-call', { 
                receiverId: receiver.userId
              });
              resetCallState();
              setIsCallTimeoutDialogOpen(true)
              updateCallStatus(CALL_STATUS.IDLE)
              handleStoreCallHistory('Unanswered')
            }
            }, CALL_TIMEOUT_DURATION);
          };

          call.on("stream", (userStream) => {
            // console.log('on Stream',userStream)
            peerStreamRef.current = userStream;
            if(remoteVideoRef.current && localVideoRef.current){
              localVideoRef.current.srcObject = currentStreamRef.current;
              remoteVideoRef.current.srcObject = userStream;
            }
          });
      }
  };

  const acceptCall = async () => {
    if(!incomingCall || !caller.userId || !currentCallRef.current) return
    
    // Make sure we have a stream
    if (!currentStreamRef.current) {
      // const callType = callTy || 'audio';
      await setupMediaStream(callType || 'audio');
    }
    
    // First add event listeners
    currentCallRef.current.on('stream', (remoteStream) => {
      const metadata = currentCallRef.current.metadata || {};
      handleAddPeerStream(remoteStream, metadata.micStatus, metadata.videoStatus);
      if(remoteVideoRef.current && localVideoRef.current){
        localVideoRef.current.srcObject = currentStreamRef.current;
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });
    
    currentCallRef.current.answer(currentStreamRef.current);
    
    socket.emit('accept-call', {callerId:caller.userId});
    updateCallStatus(CALL_STATUS.ONGOING);
    setIncomingCall(false);
    handleCallDuration();
    setCallStartTime(new Date().toISOString())

    currentCallRef.current.on('close',()=>{
      resetCallState();
    })
  }

  const resetCallState = () => {
    // Stop all media tracks
    if (currentStreamRef.current) {
      currentStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (peerStreamRef.current) {
      peerStreamRef.current.getTracks().forEach(track => track.stop());
    }

    // Reset refs
    currentStreamRef.current = null;
    peerStreamRef.current = null;
    currentCallRef.current = null;

    setIncomingCall(false);
    setMicStatus(true);
    setVideoStatus(true);
    setPeerMicStatus(true);
    setPeerVideoStatus(true);

    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);
      callDurationIntervalRef.current = null;
    }
    setCallDuration(0);
  }

  // Reject incoming call
  const rejectCall = () => {
    if (!incomingCall || !caller) return;

    // Notify the caller that the call was rejected
    socket.emit('reject-call', { 
      callerId: caller.userId
    });

    // Reset call state
    updateCallStatus(CALL_STATUS.IDLE)
    resetCallState();
    handleStoreCallHistory('Unanswered')
  }
  
  // Cancel outgoing call
  const cancelCall = () => {
    if (callStatus !== CALL_STATUS.RINGING || incomingCall) return;

    // Notify the receiver that the call was cancelled
    socket.emit('cancel-call', { 
      receiverId: selectedCallReceiver.userId
    });

    updateCallStatus(CALL_STATUS.IDLE)
    resetCallState();
    handleStoreCallHistory('Unanswered')
  }

  const handleStoreCallHistory = async (status) =>{
    console.log(caller,selectedCallReceiver)
    const callHistory = {
      callerId: caller.userId,
      receiverId: selectedCallReceiver?.userId || user.userId,
      duration: callDuration,
      callType: callType,
      status, 
      startTime: callStartTime || new Date().toISOString(),
      endTime: new Date().toISOString()
    };
    try{
    const response = await axios.post('http://localhost:5000/api/call/store/call-history', callHistory);
    if(response.status === 200){
      console.log('Call history stored successfully:', response.data);
      // if (callDurationIntervalRef.current) {
      //   clearInterval(callDurationIntervalRef.current);
      //   callDurationIntervalRef.current = null;
      // }
      // setCallDuration(0);
    }
    }catch(error) {
        console.error('Error storing call history:', error);
    }
  }

  // Hang up an ongoing call
  const hangupCall = () => {
    if (callStatus !== CALL_STATUS.ONGOING) return;

    socket.emit('hangup-call', { 
      receiverId: selectedCallReceiver?.userId || caller.userId
    });

    // Close the peer connection if it exists
    if (currentCallRef.current) {
      currentCallRef.current.close();
    }

    updateCallStatus(CALL_STATUS.ENDED);
    resetCallState();
      handleStoreCallHistory('Answered')
    
  }

  const handleCallDuration = () => {
    callDurationIntervalRef.current = setInterval(() => {
      setCallDuration((prevDuration) => prevDuration + 1);
      console.log('call duration',callDuration)
    }, 1000);
  };

  const handleBlockUser = async (peer) =>{
    try{
      const response = await axios.post('http://localhost:5000/api/contact/block-user',{
        userId:user.userId,
        peerId:peer.userId
      });
      if(response.status === 200){
        console.log(response.data.hasBlocked)
        dispatch(updateBlockedContacts({peer,hasBlocked:response.data.hasBlocked}))
        // socket.emit('notify-blocked-user',{userId:user.userId,peerId,hasBlocked:response.data.hasBlocked})
      }

    }catch(err){

    }
  }

    useEffect(() => {
      if(user.userId){
        const peer = new Peer(user.userId ,{
          secure:false,
          host:'localhost',
          port:5000,
          path:'/peerjs'
        });
        peerInstance.current = peer;
        // console.log(peer)

        peer.on("open", () => {
            socket.emit("map-userId", user.userId);
        });
      
      peer.on('call', async (call) => {
        const metadata = call.metadata || {};
        const stream = await setupMediaStream(metadata.callType)
        currentStreamRef.current=stream;
        currentCallRef.current = call;
        setCallType(metadata.callType);
        setCaller({
          userId:call.peer,
          name:metadata.name,
          avatar:metadata.avatar
        })
        setIncomingCall(true);
        updateCallStatus(CALL_STATUS.RINGING);
        
        call.on('close', () => {
          resetCallState();
        });
      });

      socket.on("received-message", ({ senderId,message,lastMessage }) => {
          dispatch(addMessage({peerId:senderId,message,lastMessage}));
        });
      }
      socket.on('update-receiver-media-status',({micStatus,videoStatus})=>{
        setPeerMicStatus(micStatus)
        setPeerVideoStatus(videoStatus)

        if (remoteVideoRef.current) {
          remoteVideoRef.current.getAudioTracks().forEach(track => {
              track.enabled = micStatus;
          });

          remoteVideoRef.current.getVideoTracks().forEach(track => {
              track.enabled = videoStatus;
          });
      }
      });

      socket.on('call-accepted',()=>{
        if (callTimeoutRef.current) {
          clearTimeout(callTimeoutRef.current);
          callTimeoutRef.current = null;
        }
        updateCallStatus(CALL_STATUS.ONGOING)
        handleCallDuration();
        setCallStartTime(new Date().toISOString())
      })

      socket.on('call-rejected', ()=>{
        updateCallStatus(CALL_STATUS.REJECTED);
        resetCallState();
    });

      socket.on('call-cancelled',()=>{
        updateCallStatus(CALL_STATUS.CANCELLED);
        resetCallState();
    });

      socket.on('call-ended',()=>{
        updateCallStatus(CALL_STATUS.ENDED);
        resetCallState();
      });
      socket.on('call-timedout',()=>{
        updateCallStatus(CALL_STATUS.IDLE);
        resetCallState();
      });

      // Handle user going offline
      // socket.on('user-offline', (data) => {
      //   if ((data.userId === selectedChat.userId || data.userId === caller?.userId) && 
      //       callStatus !== CALL_STATUS.IDLE) {
      //     alert('Call ended. User is now offline.');
      //     resetCallState();
      //   }
      // });


        return () => {
          socket.off("received-message");
          socket.off("call-accepted");
          socket.off('update-receiver-media-status');
          socket.off('call-rejected');
          socket.off('call-cancelled');
          socket.off('call-ended');
          socket.off('user-offline');
        };
    }, [dispatch,socket,user.userId]);
  
  return (
    <ChatContext.Provider value={{
      sendMessage,
      localVideoRef,
      remoteVideoRef,
      socket,
      initiateCall,
      acceptCall,
      rejectCall,
      cancelCall,
      hangupCall,
      caller,
      callType,
      currentStreamRef,
      peerStreamRef,
      CALL_STATUS,
      incomingCall,
      peerMicStatus,
      peerVideoStatus,
      micStatus,videoStatus,setMicStatus,setVideoStatus,
      isCallTimeoutDialogOpen,
      setIsCallTimeoutDialogOpen,
      checkIsBlocked,
      handleBlockUser
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);