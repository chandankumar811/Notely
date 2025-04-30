import React from 'react'
import NoteHeader from '../Notes/NoteHeader'
import NoteEditor from '../Notes/NoteEditor'

const NotePage = () => {
  return (
    <div>
       <div className="fixed top-0 right-0 left-[23.5rem] z-20 bg-white border-b">
          <NoteHeader />
        </div>
        <div className='fixed left-[23.5rem] top-29 right-0'>
            <NoteEditor/>
        </div>
    </div>
  )
}

export default NotePage
