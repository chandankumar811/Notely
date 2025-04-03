import React, { useEffect, useState } from 'react'
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeClasses } from '../../../utils/theme';
import { useDispatch, useSelector } from 'react-redux';
import { EllipsisVertical, Trash2 } from 'lucide-react';
import axios from 'axios';
import { removeCallHistory } from '../../../redux/slices/chat/chatSlice';

const CALL_ICON = {
    VIDEO:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video-icon lucide-video"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>',
    AUDIO:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone-icon lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    OUTGOING:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-up-right-icon lucide-move-up-right"><path d="M13 5H19V11"/><path d="M19 5L5 19"/></svg>',
    INCOMING:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-move-down-left-icon lucide-move-down-left"><path d="M11 19H5V13"/><path d="M19 5L5 19"/></svg>'
}

const CallHistoryItem = ({call,selectCall}) => {

    const dispatch = useDispatch();
    const {darkMode} = useTheme();
    const themeClasses = getThemeClasses(darkMode);
    const selectedCallHistory = useSelector(state => state.chat.selectedCallHistory)
    const user = useSelector(state => state.user)
    const [caller,setCaller] = useState(false)


    useEffect(()=>{
        if(call.caller.userId === user.userId){
            setCaller(true)
        }else{
            setCaller(false)
        }
    },[call.caller.userId,user.userId])

    const handleDeleteCallHistory = async (event) =>{
      event.stopPropagation();
      try {
        const response = await axios.delete(`http://localhost:5000/api/call/delete-call-history/${user.userId}/${call._id}`);
        if(response.status === 200){
          console.log(response.data)
          dispatch(removeCallHistory(call._id))
        }
        
      } catch (err) {
        console.log(err)
      }
    }

    const getCallStyle = () =>{
        if(caller){
            if(call.callType==='video'){
                return call.status==='missed'? CALL_ICON.VIDEO+'<span>Missed</span>'+CALL_ICON.OUTGOING: CALL_ICON.VIDEO+'<span>Outgoing</span>'+CALL_ICON.OUTGOING
            }
            else{
                return call.status==='missed'? CALL_ICON.AUDIO+'<span>Missed</span>'+CALL_ICON.OUTGOING: CALL_ICON.VIDEO+'<span>Outgoing</span>'+CALL_ICON.OUTGOING
            }
        }
        else{
            if(call.callType==='video'){
                return call.status==='missed'? CALL_ICON.VIDEO+'<span>Missed</span>'+CALL_ICON.INCOMING: CALL_ICON.VIDEO+'<span>Incoming</span>'+CALL_ICON.INCOMING
            }
            else{
                return call.status==='missed'? CALL_ICON.AUDIO+'<span>Missed</span>'+CALL_ICON.INCOMING: CALL_ICON.VIDEO+'<span>Incoming</span>'+CALL_ICON.INCOMING
            }
        }

    }

    const formatCallTimestamp = (timestamp) => {
      const callDate = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
    
      const isToday = callDate.toDateString() === today.toDateString();
      const isYesterday = callDate.toDateString() === yesterday.toDateString();
    
      const time = callDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    
      if (isToday) return time;
      if (isYesterday) return `Yesterday`;
    
      return callDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) ;
    };

  return (
    <div>
      <div
      key={call._id}
      className={`flex items-center p-4 ${
        selectedCallHistory?.userId === call.receiver.userId
          ? themeClasses.chatContactActive
          : themeClasses.chatContact
      } cursor-pointer`}
      onClick={() => selectCall(caller,call)}
    >
      <div className="relative">
        <div className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}>
          <img src={caller?call.receiver.avatar:call.caller.avatar} alt={(caller?call.receiver.name:call.caller.name).charAt(0).toUpperCase()} className='w-full h-full object-cover rounded-full'/>
        </div>
        
      </div>
      <div className="ml-3 flex-1 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="flex font-semibold text-base">{caller?call.receiver.name:call.caller.name}</span>
          <div className={`flex items-center gap-1 text-xs ${call.status==='missed'?'text-red-400':'text-gray-400'}`} dangerouslySetInnerHTML={{ __html: getCallStyle() }}></div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className={`text-[9px] ${themeClasses.contactStatusText}`}>{formatCallTimestamp(call.timestamp)}</span>
          <div className="">
            <button onClick={handleDeleteCallHistory} className={`p-2 ${darkMode?'bg-black/20':'bg-black/5'} rounded-full text-red-400`}><Trash2 size={14} /></button>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default CallHistoryItem
