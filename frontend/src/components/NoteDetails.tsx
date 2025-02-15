import { Note } from '../api/types'

const NoteDetails = ({
  note,
  onDelete,
}: {
  note: Note
  onDelete: (id: number) => void
}) => {
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US')
  return (
    <div className='note-container'>
      <p className='note-title'>{note.title}</p>
      <p className='note-contant'>{note.content}</p>
      <p className='note-date'>{formattedDate}</p>
      <button className='delete-button' onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </div>
  )
}

export default NoteDetails
