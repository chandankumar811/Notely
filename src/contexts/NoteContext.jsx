import { createContext, useContext, useState } from "react";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
    const [addNewNoteOpen, setAddNewNoteOpen] = useState(false);
    const [editNoteProfileOpen, setEditNoteProfileOpen] = useState(false);
    
    return (
        <NoteContext.Provider value={{ addNewNoteOpen, setAddNewNoteOpen, editNoteProfileOpen, setEditNoteProfileOpen }}>
            {children}
        </NoteContext.Provider>
    );
}

export const useNote = () => useContext(NoteContext);