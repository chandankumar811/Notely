import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setCallHistory,setSelectedCallHistory } from '../../../redux/slices/chat/chatSlice';
import axios from 'axios';
import CallHistoryItem from './CallHistoryItem';
import { Trash2 } from 'lucide-react';
import {useTheme} from '../../../contexts/ThemeContext'

const CallHistory = () => {
    const {darkMode} = useTheme();
    const userId = useSelector(state => state.user.userId);
    const dispatch = useDispatch();
    const callHistory = useSelector(state => state.chat.callHistory);
    // const [selectedCall,setSelectedCall] = useState(null)

    useEffect(() =>{
        const fetchCallHistory = async () =>{
            try{
            const response = await axios.get(`http://localhost:5000/api/call/get/call-history/${userId}`)
            if(response.status === 200){
                console.log(response.data)
                dispatch(setCallHistory(response.data))
            }
            }catch(err){
            console.log(err)
            }
        }
        if(userId)fetchCallHistory();
    },[])

    const selectCall = (caller,call) =>{
      let callHistory;
      if(caller){
        const {caller,...rest} = call;
        callHistory=rest;
      }else{
        const {receiver,...rest} = call;
        callHistory=rest;
      }
      console.log(callHistory)
      dispatch(setSelectedCallHistory(callHistory))
    }

    const handleDeleteAllCallHistory = async () =>{
          try {
            const callIdArr = [...new Set(callHistory.flatMap(call => call._id))];
            const response = await axios.delete(`http://localhost:5000/api/call/delete-all-call-history/${userId}`,{
              data:{
                callIdArr
              }
            });
            if(response.status === 200){
              console.log(response.data)
              dispatch(setCallHistory([]))
            }
            
          } catch (err) {
            console.log(err)
          }
        }

  return (
    <div>
      {/* {!addContactOpen && !addNewChatOpen &&(<> */}
    <div className="relative">
      <div className="flex justify-between px-4 py-3 text-base " >
        <span className="text-gray-500">Call History</span>
        <button onClick={handleDeleteAllCallHistory} className={`flex items-center gap-1 text-red-600 text-xs px-2 py-1 rounded-lg ${darkMode?'bg-black/20':'bg-black/5'}`}><Trash2 size={12} />Delete All</button>
      </div>   
    </div>
      
    <div className="overflow-y-auto custom-scrollbar h-[calc(100vh-15rem)] md:h-[calc(100vh-10rem)] pb-10">
      {callHistory.length > 0 ? callHistory.map((call) => (
        <CallHistoryItem key={call._id} call={call} selectCall={selectCall}/>
      )):
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-gray-500">No Call History</span>
      </div>
      }
    </div>
    </div>
  )
}

export default CallHistory
