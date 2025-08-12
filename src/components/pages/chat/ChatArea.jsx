import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { useTheme } from "../../../contexts/ThemeContext";
import { useChat } from "../../../contexts/ChatContext";
import { getThemeClasses } from "../../../utils/theme";
import { useDispatch, useSelector } from "react-redux";
import NoMessage from "./NoMessage";
import axios from "axios";
import {
  setMessages,
  setSelectedCallHistory,
  setSelectedChat,
} from "../../../redux/slices/chat/chatSlice";
import {
  MessageSquareText,
  Phone,
  Trash2,
  UserRoundX,
  Video,
  X,
} from "lucide-react";
import Profile from "../user/profile";
import NoteHeader from "../Note/NoteHeader";
import AddNewNote from "../Note/AddNewNote";
import { useNote } from "../../../contexts/NoteContext";
import EditNoteProfile from "../Note/EditNoteProfile";

const ChatArea = ({ currentSideBar, setCurrentSideBar }) => {
  const { darkMode, isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isBlockedPopup, setIsBlockedPopup] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [hasBlocked, setHasBlocked] = useState(false);
  const [chatContextMenu, setChatContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [callContextMenu, setCallContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const { initiateCall, socket, checkIsBlocked } = useChat();
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const selectedNote = useSelector((state) => state.note.selectedNote);
  const selectedCallHistory = useSelector(
    (state) => state.chat.selectedCallHistory
  );
  const userId = useSelector((state) => state.user.userId);
  const messages = useSelector((state) => state.chat.messages);
  const blockedContacts = useSelector((state) => state.user.blockedContacts);
  const messageAreaRef = useRef(null);

  const {addNewNoteOpen, editNoteProfileOpen} = useNote();

  console.log("Edit Note Profile Open: ", editNoteProfileOpen);

  // console.log(selectedNote);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/chat/fetch/messages/${userId}/${selectedChat.userId}`
        );
        if (response.status === 200) {
          // console.log(response.data.messages)
          dispatch(setMessages(response.data.messages));
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    if (userId && selectedChat) fetchMessages();
  }, [userId, selectedChat]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messageAreaRef.current) {
        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
      }
    };
    const timer = setTimeout(scrollToBottom, 50);

    return () => clearTimeout(timer);
  }, [messages, currentSideBar]);

  const getCallDay = (timestamp) => {
    const callDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = callDate.toDateString() === today.toDateString();
    const isYesterday = callDate.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";

    return callDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const getCallTime = (timestamp) => {
    const callDate = new Date(timestamp);
    return callDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCallingMessage = () => {
    const user = selectedCallHistory?.caller || selectedCallHistory?.receiver;
    const chat = {
      userId: user.userId,
      name: user.name,
      avatar: user.avatar,
    };
    dispatch(setSelectedChat(chat));
    setCurrentSideBar("chatList");
    dispatch(setSelectedCallHistory(null));
  };

  const getCallHistoryDuration = (duration) => {
    if (duration < 60) {
      return `${duration}s`;
    }

    const mins = Math.floor(duration / 60);
    const secs = duration % 60;

    if (mins < 60) {
      return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
    }

    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;

    return remainingMins > 0 || secs > 0
      ? `${hrs}h ${remainingMins > 0 ? `${remainingMins}m ` : ""}${
          secs > 0 ? `${secs}s` : ""
        }`
      : `${hrs}h`;
  };

  useEffect(() => {
    if (selectedChat || selectedCallHistory) {
      const userId = selectedChat
        ? selectedChat?.userId
        : selectedCallHistory?.caller?.userId ||
          selectedCallHistory?.receiver?.userId;
      setHasBlocked(
        blockedContacts.some((contact) => contact.userId === userId)
      );
    }
  }, [selectedChat, selectedCallHistory, blockedContacts]);

  useEffect(() => {
    if (selectedChat || selectedCallHistory) {
      const userId = selectedChat
        ? selectedChat?.userId
        : selectedCallHistory?.caller?.userId ||
          selectedCallHistory?.receiver?.userId;
      checkIsBlocked(userId).then((isBlocked) => {
        setIsBlocked(isBlocked);
      });
    }
  }, [selectedChat, selectedCallHistory]);

  useEffect(() => {
    setIsBlockedPopup(false);
  }, [currentSideBar]);

  return (
    <div className="w-full">
      {(currentSideBar === "chatList" || currentSideBar === "starChats") &&
        (selectedChat ? (
          <div
            className={`${
              isMobile && !selectedChat ? "hidden" : "flex"
            } relative flex-1 flex flex-col h-full`}
          >
            <ChatHeader
              isBlocked={isBlocked}
              hasBlocked={hasBlocked}
              setIsBlockedPopup={setIsBlockedPopup}
            />
            {/* Messages area */}
            {loading ? (
              <div
                className={`flex flex-1 p-4 items-center justify-center ${themeClasses.chatArea}`}
              >
                <div className="text-md text-gray-500">Loading messages...</div>
              </div>
            ) : messages?.length > 0 ? (
              <div
                ref={messageAreaRef}
                className={`flex-1 p-4 overflow-y-auto custom-scrollbar ${themeClasses.chatArea}`}
              >
                {messages.map((message) => (
                  <MessageBubble key={message._id} message={message} />
                ))}
                {isBlockedPopup && (
                  <div className="w-full h-full flex items-center justify-center absolute z-10 inset-0 bg-black/50">
                    <div
                      className={`flex flex-col items-center rounded-lg w-[300px] p-4 ${themeClasses.chatHeader}`}
                    >
                      <span className="text-center">
                        You are Blocked by <strong>{selectedChat.name}</strong>,
                        you can't contact!!
                      </span>
                      <button
                        onClick={() => setIsBlockedPopup(false)}
                        className="mt-2 w-fit px-3 py-1 bg-blue-500 text-white rounded-md"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`flex flex-1 p-4 items-center justify-center ${themeClasses.chatArea}`}
              >
                <NoMessage />
              </div>
            )}

            {/* Chat input */}
            <ChatInput
              setIsBlockedPopup={setIsBlockedPopup}
              isBlocked={isBlocked}
              hasBlocked={hasBlocked}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-md text-gray-500">
              Select a chat to start messaging
            </div>
          </div>
        ))}

      {/* call History */}
      {currentSideBar === "callHistory" &&
        (selectedCallHistory ? (
          <div
            className={`${
              isMobile && !selectedCallHistory ? "hidden" : "flex"
            } flex-col items-center`}
          >
            <div
              className={`w-full px-5 py-3 flex items-center gap-3 border-b ${themeClasses.chatHeader}`}
            >
              <button
                onClick={() => dispatch(setSelectedCallHistory(null))}
                className={`p-2 rounded-full ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <X size={24} />
              </button>
              <h1 className="text-xl font-semibold">Call Info</h1>
            </div>

            <div
              className={`w-full h-[calc(100vh-60px)] ${themeClasses.chatArea}`}
            >
              <div
                className={`w-[95%] mx-auto mt-10 border border-gray-300 rounded-md ${themeClasses.chatHeader}`}
              >
                <div
                  className={`flex items-center flex-wrap gap-y-3 justify-between px-6 py-4 border-b ${
                    darkMode ? "border-gray-700" : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        selectedCallHistory?.caller?.avatar ||
                        selectedCallHistory?.receiver?.avatar
                      }
                      alt=""
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-semibold">
                        {selectedCallHistory?.caller?.name ||
                          selectedCallHistory?.receiver?.name}
                      </span>
                      {hasBlocked && (
                        <span className="text-red-500 text-[10px] font-semibold">
                          [ Blocked User ]
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCallingMessage}
                      className={`p-3 rounded-full ${
                        darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                      }`}
                    >
                      <MessageSquareText size={20} />
                    </button>
                    <button
                      onClick={() => {
                        isBlocked
                          ? setIsBlockedPopup(true)
                          : initiateCall(
                              selectedCallHistory?.caller ||
                                selectedCallHistory?.receiver,
                              "video"
                            );
                      }}
                      className={`p-2 rounded-full ${
                        darkMode
                          ? `${
                              hasBlocked
                                ? "text-gray-700"
                                : "text-gray-200 hover:bg-gray-700"
                            }`
                          : `${
                              hasBlocked
                                ? "text-gray-300"
                                : "text-gray-600 hover:bg-gray-200"
                            }`
                      }`}
                    >
                      <Video size={22} />
                    </button>
                    <button
                      onClick={() => {
                        isBlocked
                          ? setIsBlockedPopup(true)
                          : initiateCall(
                              selectedCallHistory?.caller ||
                                selectedCallHistory?.receiver,
                              "audio"
                            );
                      }}
                      className={`p-2 rounded-full ${
                        darkMode
                          ? `${
                              hasBlocked
                                ? "text-gray-700"
                                : "text-gray-200 hover:bg-gray-700"
                            }`
                          : `${
                              hasBlocked
                                ? "text-gray-300"
                                : "text-gray-600 hover:bg-gray-200"
                            }`
                      }`}
                    >
                      <Phone size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-5 flex-wrap justify-between px-4 py-3">
                  <div className="">
                    <span className="font-semibold">
                      {getCallDay(selectedCallHistory?.timestamp)}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className="mr-1">
                        {selectedCallHistory?.callType === "video" ? (
                          <Video size={18} />
                        ) : (
                          <Phone size={18} />
                        )}
                      </div>
                      {selectedCallHistory?.receiver ? (
                        <span className="">Outgoing</span>
                      ) : (
                        <span className="">
                          Incoming
                          {selectedCallHistory.status === "missed" && " Missed"}
                        </span>
                      )}
                      {selectedCallHistory?.callType === "video" ? (
                        <span className="">Video Call</span>
                      ) : (
                        <span className="">Audio Call</span>
                      )}
                      <span className="">
                        at {getCallTime(selectedCallHistory?.timestamp)}
                      </span>
                    </div>
                    <span className="text-sm">
                      Call Duration:{" "}
                      {getCallHistoryDuration(selectedCallHistory?.duration)}
                    </span>
                  </div>
                  <span className="">{selectedCallHistory?.status}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-md text-gray-500">
              Select a call history to get information
            </div>
          </div>
        ))}

      {/* NoteArea */}
      {currentSideBar === "noteList" && !addNewNoteOpen && !editNoteProfileOpen &&
        (selectedNote ? (
          <div
            className={`${
              isMobile && !selectedNote ? "hidden" : "flex"
            } relative flex-1 flex flex-col h-full`}
          >
            <NoteHeader />

          <div className={`flex-1 p-4 overflow-y-auto custom-scrollbar ${themeClasses.chatArea}`}>
            <textarea name="" id="" className={`w-full h-full outline-none ${themeClasses.messageInput} p-2`}></textarea>
          </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-md text-gray-500">
              Select note to start read and write
            </div>
          </div>
        ))}

         {addNewNoteOpen && (
          <div className="">
            <AddNewNote/>
          </div>
         )}

         {editNoteProfileOpen && (
          <div className="">
            <EditNoteProfile/>
          </div>
         )}
         
        

      {/* User Profile */}

      {currentSideBar === "userProfile" && (
        <div className="w-full h-full">
          <Profile setCurrentSideBar={setCurrentSideBar} />
        </div>
      )}
    </div>
  );
};

export default ChatArea;
