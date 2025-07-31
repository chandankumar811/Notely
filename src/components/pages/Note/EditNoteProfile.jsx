import { Pencil, X } from "lucide-react";
import React, { useState, useEffect } from "react";
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
              <img src="LOGO.png" alt="" />
              <button className="absolute w-full h-8 right-0 bottom-0 bg-black/50 flex justify-center items-center text-gray-200">
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
    </div>
  );
};

export default EditNoteProfile;
