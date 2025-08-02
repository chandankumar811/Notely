import { Pencil, Upload, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getThemeClasses } from "../../../utils/theme";
import { useNote } from "../../../contexts/NoteContext";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedNote,
  updateNoteList,
  updateNoteProfile,
} from "../../../redux/slices/note/noteSlice";
import axios from "axios";

const EditNoteProfile = () => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const { setEditNoteProfileOpen } = useNote();
  const { selectedNote } = useSelector((state) => state.note);
  const [contactResult, setContactResult] = useState([]);
  const [privilege, setPrivilege] = useState({});
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [title, setTitle] = useState(selectedNote.title);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [previewURL, setPreviewURL] = useState("");
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const phoneInputRef = useRef(null);
    const addressInputRef = useRef(null);

    // console.log("note Avatar:", noteAvatar.avatar)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/contact/fetch-contact/${user.userId}`
        );
        if (response.status === 200) {
          console.log("Contacts fetched successfully:", response.data);
          setContactResult(response.data);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    fetchContact();
  }, []);

  useEffect(() => {
    if (selectedNote?.participants) {
      const selectedIds = selectedNote.participants.map(
        (p) => p.userId.userId || p.userId
      );
      const privilegeMap = {};
      selectedNote.participants.forEach((p) => {
        const id = p.userId.userId || p.userId;
        privilegeMap[id] = p.privilege;
      });
      setSelectedContacts(selectedIds);
      setPrivilege(privilegeMap);
    }
  }, [selectedNote]);

  // console.log("Selected Contacts: ", selectedContacts);

  const toggleContactSelection = (contactId) => {
    setSelectedContacts((prev) => {
      if (prev.includes(contactId)) {
        const updateedPrivileges = { ...privilege };
        delete updateedPrivileges[contactId];
        setPrivilege(updateedPrivileges);
        return prev.filter((id) => id !== contactId);
      } else {
        setPrivilege((prev) => ({
          ...prev,
          [contactId]: "write", // Default privilege
        }));
        return [...prev, contactId];
      }
    });
  };

  const handleUpdateNote = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/note/update-note-profile/${selectedNote.noteId}`,
        {
          title,
          participant: selectedContacts.map((id) => ({
            userId: id,
            name: contactResult.find((contact) => contact._id === id).name,
            avatar: contactResult.find((contact) => contact._id === id).avatar,
            privilege: privilege[id] || "read",
          })),
        }
      );
      if (response.status === 200) {
        console.log("Note updated successfully:", response.data);
        dispatch(setSelectedNote(response.data.note));
        dispatch(updateNoteProfile(response.data.note));
        setEditNoteProfileOpen(false);
      }
    } catch (error) {
      console.error(
        "Error updating note:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  }


  const handleAvatarUpload = async () => {
    if (!selectedImage) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("noteId", selectedNote._id);

    for (let pair of formData.entries()) {
    console.log(`${pair[0]}:`, pair[1]);
  }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/note/update-note-avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log('avatar:', response.data.note.avatar)
      if (response.status === 200) {
        dispatch(setSelectedNote(response.data.note));
        dispatch(updateNoteProfile(response.data.note));
        setSelectedImage(null);
        setPreviewURL('');
        setShowAvatarModal(false);
      }
      
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setUploading(false);
    }
  }

  const handleCancelUpload = () => {
    setSelectedImage(null);
    setPreviewURL('');
    setShowAvatarModal(false);
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div
        className={`w-full px-5 py-3 flex items-center gap-3 border-b ${themeClasses.chatHeader}`}
      >
        <button
          onClick={() => setEditNoteProfileOpen(false)}
          className={`p-2 rounded-full ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
          }`}
        >
          <X size={24} />
        </button>
        <h1 className="text-xl font-semibold">Edit Note Profile</h1>
      </div>
      <div
        className={`w-full h-full overflow-y-scroll custom-scrollbar px-5 ${themeClasses.chatArea}`}
      >
        <div
          className={` w-full h-max mx-auto mt-10 p-5 flex-col items-start border border-gray-300 rounded-md ${themeClasses.chatHeader}`}
        >
          <div className="w-full flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-10">
            <div
              className={`flex items-center justify-center relative w-48 h-48 rounded-full p-1 bg-blue-100 overflow-hidden`}
            >
              <img src={selectedNote.avatar} alt="" />
              <button onClick={() => setShowAvatarModal(true)} className="absolute w-full h-8 right-0 bottom-0 bg-black/50 flex justify-center items-center text-gray-200">
                <Pencil size={20} />
              </button>
            </div>
            <div className="w-full flex-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter note title"
                className={`w-full p-3 rounded-md outline-none text-3xl ${themeClasses.messageInput} `}
              />
              <div className="flex items-center mt-5">
                <button
                  onClick={handleUpdateNote}
                  className="flex justify-center w-full items-center px-3 py-2 cursor-pointer bg-blue-600 rounded-md text-gray-200 text-base font-semibold"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={` w-full h-max mx-auto my-10 p-4 border border-gray-300 rounded-md ${themeClasses.chatHeader}`}
        >
          <div className="flex items-center">
            <span className="">Add members</span>
          </div>
          <div className="w-full h-[350px] overflow-y-scroll custom-scrollbar mt-10 flex flex-col">
            {contactResult.map((contact) => (
              <div
                key={contact.userId}
                onClick={() => toggleContactSelection(contact.userId)}
                className={`group w-full flex justify-between items-center *: rounded-lg px-3 py-2 ${
                  darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <div className=" w-full flex items-center relative">
                  <div
                    className={`w-12 h-12 rounded-full ${themeClasses.contactInitialBg} flex items-center justify-center font-bold`}
                  >
                    <img
                      src={contact.avatar}
                      alt={contact.name.charAt(0).toUpperCase()}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="ml-3 flex flex-col">
                    <span className="font-semibold text-base">
                      {contact.name}
                    </span>
                    <span
                      className={`text-xs ${themeClasses.contactStatusText}`}
                    >
                      {contact.email}
                    </span>
                  </div>

                  {selectedContacts.includes(contact.userId) && (
                    <div
                      className={`absolute items-center gap-2 right-0 `}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        name="privilege"
                        value={privilege[contact.userId] || "read"}
                        onChange={(e) =>
                          setPrivilege((prev) => ({
                            ...prev,
                            [contact.userId]: e.target.value,
                          }))
                        }
                        className="outline-none text-sm "
                      >
                        <option
                          value="write"
                          className={`${
                            darkMode
                              ? "bg-gray-900 text-white"
                              : "bg-white text-gray-900"
                          }`}
                        >
                          {" "}
                          Write
                        </option>
                        <option
                          value="read"
                          className={`${
                            darkMode
                              ? "bg-gray-900 text-white"
                              : "bg- text-gray-900"
                          }`}
                        >
                          {" "}
                          Read
                        </option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showAvatarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div
          className={`w-[90%] max-w-md p-6 rounded-lg ${
            darkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <h2 className="text-xl font-semibold mb-4">
            Update Your Note Avatar
          </h2>

          <div className="mb-4">
            {previewURL ? (
              <div className="relative w-40 h-40 mx-auto">
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-full"
                />
                <button onClick={() => {
                  setPreviewURL("");
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }} className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center p-4 border-2 border-gray-500 border-dashed rounded-lg">
                <Upload size={32} className={`mb-2 ${darkMode ? 'text-gray-400':'text-gray-600'}`}/>
                <p className="text-sm text-center">Click to select avatar image.</p>
                <input onChange={handleImageChange} type="file" accept="image/*" className="absolute w-full h-full opacity-0 cursor-pointer"/>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={handleCancelUpload} className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600': 'bg-gray-200 hover:bg-gray-300'}`}>Cancel</button>
            <button onClick={handleAvatarUpload} disabled={!selectedImage || uploading} className={`px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 ${(!selectedImage || uploading) && 'opacity-50 cursor-not-allowed'}`}>{uploading ? 'uploading...' : 'Update'}</button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default EditNoteProfile;
