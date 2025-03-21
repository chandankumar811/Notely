import React, { createContext, useState, useContext, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addMessage, setCallStatus } from '../redux/slices/chat/chatSlice';
import { io } from 'socket.io-client';
import Peer from 'peerjs';

const ChatContext = createContext();
let socket;
const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000");
  }
  return socket;
};

const CALL_STATUS = {
  IDLE:'idle',
  RINGING:'ringing',
  ONGOING:'ongoing',
  ENDED:'ended'
}

export const ChatProvider = ({ children }) => {

  const dispatch = useDispatch();
  
  const selectedChat = useSelector(state => state.chat.selectedChat)
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
  const [peerMicStatus,setPeerMicStatus] = useState(true);
  const [peerVideoStatus,setPeerVideoStatus] = useState(true);
  // const [callStatus, setCallStatus] = useState(CALL_STATUS.IDLE);

  const [isCalling,setIsCalling] = useState(false) 
  const [callerId,setCallerId] = useState('')
  const [ringtonePlaying,setRingtonePlaying] = useState(false)
  const [incomingCall,setIncomingCall] = useState(false)
  const [incomingCallType,setIncomingCallType] = useState('')
  const callTimeoutRef = useRef(null);
  const CALL_TIMEOUT_DURATION = 30000;

  
    const sendMessage = async (message,attachment) =>{
        try{
          const response = await axios.post('http://localhost:5000/api/chat/send-message',{
            senderId:user.userId,
            receiverId:selectedChat.userId,
            message,
            attachment
          });
          if(response.status === 200){
            dispatch(addMessage(response.data.message))
            socket.emit('new-message',{receiverId:selectedChat.userId,message:response.data.message})
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
        // if (localVideoRef.current) {
        //   localVideoRef.current.srcObject = stream;
        // }
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



    const initiateCall = async (callType) => {

      if (callStatus !== CALL_STATUS.IDLE) {
        console.log('Cannot initiate call: already in a call state');
        return;
      }
      
      const stream = await setupMediaStream(callType);
      if (!selectedChat.userId || !peerInstance.current || !currentStreamRef.current) return;

      if (selectedChat.userId) {
          const call = peerInstance.current.call(selectedChat.userId, currentStreamRef.current,{
            metadata: {
              callType,
              micStatus,
              videoStatus
            }
          });
          if(call) {
            updateCallStatus(CALL_STATUS.RINGING);

            callTimeoutRef.current = setTimeout(() => {
              if (callStatus === CALL_STATUS.RINGING) {
              endCall();
              }
            }, CALL_TIMEOUT_DURATION);
          };

          call.on("stream", (userStream) => {
            peerStreamRef.current = userStream;
          });
      }
  };

  const acceptCall = () => {
    if(!incomingCall || !callerId || !currentCallRef.current) return
    console.log(currentStreamRef.current)
    socket.emit('accept-call', {callerId})
    // Pass the media stream, not the call object
    currentCallRef.current.answer(currentStreamRef.current);
    currentCallRef.current.on('stream', (remoteStream) => {
      const metadata = currentCallRef.current.metadata;
      console.log(metadata)
      handleAddPeerStream(remoteStream, metadata.micStatus, metadata.videoStatus)
    });
    dispatch(setCallStatus(CALL_STATUS.ONGOING))
    setIncomingCall(false);
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
        console.log(peer)

        peer.on("open", () => {
            socket.emit("map-userId", user.userId);
        });
      
      peer.on('call', async (call) => {
        const metadata = call.metadata || {};
        console.log('incoming call',call)
        const stream = await setupMediaStream(metadata.callType)
        currentStreamRef.current=stream;
        currentCallRef.current = call;
        setCallerId(call.peer)
        setIncomingCall(true);
        setIncomingCallType(metadata.callType);
        dispatch(setCallStatus(CALL_STATUS.RINGING))
        console.log(chatList)
        // call.answer(currentStreamRef.current);
        // socket.emit('update-receiver-media',({callerId:call.peer,micStatus,videoStatus}))
        // call.on('stream', (remoteStream) => {
        //   handleAddPeerStream(remoteStream,metadata.micStatus,metadata.videoStatus)
        // });

        call.on('close', () => {
        });
      });

      socket.on("received-message", ({ message }) => {
          dispatch(addMessage(message));
        });
      }
      socket.on('update-receiver-media-status',({micStatus,videoStatus})=>{
        setPeerMicStatus(micStatus)
        setPeerVideoStatus(videoStatus)
      });

      socket.on('call-accepted',()=>{
        if (callTimeoutRef.current) {
          clearTimeout(callTimeoutRef.current);
          callTimeoutRef.current = null;
        }
        dispatch(setCallStatus(CALL_STATUS.ONGOING))
      })


        return () => {
          socket.off("received-message");
        };
    }, [dispatch,socket,user.userId]);
  
  return (
    <ChatContext.Provider value={{sendMessage,socket,initiateCall,acceptCall,currentStreamRef,peerStreamRef,CALL_STATUS,incomingCall}}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);