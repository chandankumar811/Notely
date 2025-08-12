import { Cross, GroupIcon, Pencil, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import { getThemeClasses } from "../../../utils/theme";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNote } from "../../../contexts/NoteContext";
import { updateNoteList } from "../../../redux/slices/note/noteSlice";

const AddNewNote = () => {
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);
  const user = useSelector((state) => state.user);
  const [contactResult, setContactResult] = useState([]);
  const [selectedContact, setSelectedContact] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [privilege, setPrivilege] = useState({});
  const { setAddNewNoteOpen } = useNote();
  const dispatch = useDispatch();

  const handleCreateNote = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/note/new-note",
        {
          creatorId: user.userId,
          title,
          participant: selectedContact.map((id) => ({
            userId: contactResult.find((contact) => contact._id === id).userId,
            name: contactResult.find((contact) => contact._id === id).name,
            avatar: contactResult.find((contact) => contact._id === id).avatar,
            privilege: privilege[id] || "read",
          })),
        }
      );
      if (response.status === 200) {
        // console.log("Note created successfully:", response.data);
        setAddNewNoteOpen(null);
        dispatch(updateNoteList(response.data.note));
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/contact/fetch-contact/${user.userId}`
        );
        if (response.status === 200) {
          // console.log("Contacts fetched successfully:", response.data);
          setContactResult(response.data);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      }
    };
    fetchContact();
  }, []);

   

  const toggleContactSelection = (id) => {
    setSelectedContact((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };
  // console.log("Contacts:", contactResult);
  console.log("Selected Contacts:", selectedContact);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div
        className={`w-full px-5 py-3 flex items-center gap-3 border-b ${themeClasses.chatHeader}`}
      >
        <button
          onClick={() => dispatch(setAddNewNoteOpen(null))}
          className={`p-2 rounded-full ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
          }`}
        >
          <X size={24} />
        </button>
        <h1 className="text-xl font-semibold">Add new note</h1>
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
              <GroupIcon size={60} className="text-gray-600" />
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
              <div className="flex items-center gap-5 mt-5">
                <button className="flex justify-center items-center px-3 py-2 cursor-pointer text-gray- bg-gray-400 rounded-md text-base font-semibold">
                  Skip
                </button>
                <button onClick={handleCreateNote} className="flex justify-center items-center px-3 py-2 cursor-pointer bg-blue-600 rounded-md text-gray-200 text-base font-semibold">
                  Create
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
                key={contact._id}
                onClick={() => toggleContactSelection(contact._id)}
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
                  {selectedContact.includes(contact._id) && (
                    <div
                      className={`absolute items-center gap-2 right-0 `}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <select
                        name="privilege"
                        value={privilege[contact._id] || "read"}
                        onChange={(e) => setPrivilege((prev) => ({...prev, [contact._id]: e.target.value }))}
                        className="outline-none text-sm "
                      >
                        <option value="write" className={`${ darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900" }`}> Write</option>
                        <option value="read" className={`${ darkMode ? "bg-gray-900 text-white" : "bg- text-gray-900"}`} > Read</option>
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

export default AddNewNote;
