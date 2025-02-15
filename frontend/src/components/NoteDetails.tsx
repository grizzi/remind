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
    <div className='max-w-sm rounded overflow-hidden shadow-lg'>
      <p className='font-bold text-xl mb-2'>{note.title}</p>
      <p className='text-gray-700 text-base'>{note.content}</p>
      <p className='note-date'>{formattedDate}</p>
      <button
        className='rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'
        onClick={() => onDelete(note.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default NoteDetails
