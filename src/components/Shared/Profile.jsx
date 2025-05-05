import {
  Check,
  Files,
  MapPin,
  Pencil,
  Phone,
  User,
  UserRoundX,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  updateUserAddress,
  updateUserPhoneNumber,
} from "../../redux/slices/user/userSlice";

const Profile = ({setOpenProfile}) => {
  const [isPhoneEdit, setIsPhoneEdit] = useState(false);
  const [isAddressEdit, setIsAddressEdit] = useState(false);
  const { darkMode, isMobile } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [copied, setCopied] = useState(false);

  const [phone, setPhone] = useState(user.phoneNumber);
  const [address, setAddress] = useState(user.address);
    console.log("uid", user);

  const chatData = [
    {
      id: 1,
      name: "Anish Ncell Gupta",
      lastMessage: "Video call",
      time: "11:49 PM",
      avatar: "/api/placeholder/40/40",
      unread: 0,
      status: "In call",
      isOnline: true,
    },
    {
      id: 2,
      name: "THE DEVELOPER COM...",
      lastMessage: "~PRINCE MISHRA: Fronte...",
      time: "Yesterday",
      avatar: null,
      unread: 3,
      isGroup: true,
    },
    {
      id: 3,
      name: "Laila ❤️",
      lastMessage: "Image",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 1,
      hasMedia: true,
    },
    {
      id: 4,
      name: "G.U.L.G.U.L",
      lastMessage: "bhai aese hi bna dena",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 0,
    },
    {
      id: 5,
      name: "AI",
      lastMessage: "Team 080: AI report.docx · 9...",
      time: "Yesterday",
      avatar: null,
      unread: 5,
      hasFile: true,
    },
    {
      id: 6,
      name: "GDG Lucknow",
      lastMessage: 'Group "GDG L1" was added',
      time: "Yesterday",
      avatar: null,
      unread: 4,
      isGroup: true,
    },
    {
      id: 7,
      name: "Anand Classmate",
      lastMessage: "7459888644@ptsbis",
      time: "Yesterday",
      avatar: "/api/placeholder/40/40",
      unread: 0,
      hasLink: true,
    },
  ];

  const handleCopyUID = () => {
    navigator.clipboard
      .writeText(user.uid)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1500);
      })
      .catch((error) => {
        console.error("Error copying UID:", error);
      });
  };

  const handleUpdateUserPhone = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/update-user",
        { userId: user.uid, phone },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("User phone number updated successfully:", response.data);
        dispatch(updateUserPhoneNumber(phone));
        setIsPhoneEdit(false);
      }
    } catch (error) {
      console.error("Error updating user phone number:", error);
    }
  };

  console.log("avatar", user.avatar);

  const handleUpdateUserAddress = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/update-user",
        { userId: user.uid, address },
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log("User address updated successfully:", response.data);
        dispatch(updateUserAddress(address));
        setIsAddressEdit(false);
      }
    } catch (error) {
      console.error("Error updating user address:", error);
    }
  };
  return (
    <div
      className={` overflow-y-auto border-2 border-gray-500 ${themeClasses.container} rounded-lg shadow-lg px-4 space-y-3 ${isMobile ? "w-full" : "w-2/5 min-w-[400px]"}`}
    >
      <div
        className={`flex sticky top-0 left-0 z-10  justify-between items-center border-b border-gray-500 pb-2 ${themeClasses.container} `}
      >
        <p className="font-bold text-gray-300">Profile Info</p>
        <button onClick={() => setOpenProfile(false)} className="text-gray-500 hover:text-gray-700 p-2 ">
          <X size={30} className="text-gray-500 hover:text-gray-200" />
        </button>
      </div>
      <div className="flex flex-col items-center space-y-0 relative">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-28 h-28 rounded-full mx-auto"
        />
        <p className="text-center text-lg font-semibold text-gray-300">
          {user.name}
        </p>
        <p className="text-center text-gray-500">Online</p>
        <div className="absolute flex top-1 right-2 text-xs text-gray-400 border border-gray-700 p-0.5 rounded-sm gap-1">
          <span>UID: </span>
          <span className="">{user.uid}</span>
          <button
            onClick={handleCopyUID}
            className="cursor-pointer text-blue-500"
          >
            <Files size={15} />
          </button>
        </div>
        {copied && (
          <div className="absolute -top-3 right-2 text-xs text-green-500 gap-1">
            <span>Copied!</span>
          </div>
        )}
      </div>
      <div className="divide-y divide-gray-200">
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex items-center justify-center gap-x-3">
            <span className="w-6 h-6 rounded-full ">
              <User size={20} />
            </span>
            <p className="text-gray-300">Name</p>
          </div>
          <div className="text-blue-500 font-semibold">{user.name}</div>
        </div>
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex gap-x-3 items-center justify-center">
            <span className="w-6 h-6 rounded-full">
              <Phone size={20} />
            </span>
            <span className="text-gray-300">Phone </span>
          </div>

          {isPhoneEdit ? (
            <div>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="border border-gray-300 rounded px-2 py-1 mr-2 text-sm"
              />
              <button
                onClick={handleUpdateUserPhone}
                className="cursor-pointer"
              >
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div className="text-blue-500 font-semibold">
              {user.phoneNumber ? (
                <div className="flex space-x-5 items-center">
                  <span>{user.phoneNumber}</span>
                  <button
                    className="cursor-pointer"
                    onClick={() => setIsPhoneEdit(true)}
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsPhoneEdit(true)}
                  className="cursor-pointer"
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-2 py-3">
          <div className="flex gap-x-3 items-center justify-center">
            <span className="w-6 h-6 rounded-full">
              <MapPin size={20} />
            </span>
            <span className="text-gray-300">Address </span>
          </div>

          {isAddressEdit ? (
            <div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                className="border border-gray-300 rounded px-2 py-1 mr-2 text-sm"
              />
              <button
                onClick={handleUpdateUserAddress}
                className="cursor-pointer"
              >
                <Check size={20} />
              </button>
            </div>
          ) : (
            <div className="text-blue-500 font-semibold">
              {user.address ? (
                <div className="flex space-x-5 items-center">
                  <span className="font-light text-sm text-wrap text-right">
                    {user.address}
                  </span>
                  <button
                    className="cursor-pointer"
                    onClick={() => setIsAddressEdit(true)}
                  >
                    <Pencil size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddressEdit(true)}
                  className="cursor-pointer"
                >
                  Add
                </button>
              )}
            </div>
          )}
        </div>
        <div className="divide-none px-2 py-3">
          <p className="flex gap-3 px-2 py-3">
            <UserRoundX size={20} />
            <span>Blocked user</span>
          </p>
          {chatData.map((chatData) => (
            <div
              key={chatData.id}
              className={`flex items-center justify-between p-3  ${
                themeClasses.item
              } ${darkMode ? "text-gray-100" : "text-gray-800"} border-b`}
            >
              <div className="flex items-center gap-x-3">
                <img
                  src="vite.svg"
                  alt={chatData.name}
                  className="w-8 h-8 rounded-full"
                />
                <p className="text-base">{chatData.name}</p>
              </div>
              <button className="text-blue-500 text-sm p-2 cursor-pointer">
                Unblock
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
