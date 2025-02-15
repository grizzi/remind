import { useState, useEffect } from 'react'
import NoteDetails from '../components/NoteDetails'
import { Note } from '../api/types'
import { Sidebar } from '../components/Sidebar'

import api, { Api } from '../api/api'

const Home = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    getNotes()
  }, [])

  const getNotes = () => {
    Api.fetchNotes(setNotes)
  }

  const deleteNote = (id: number) => {
    api
      .delete(`/api/notes/delete/${id}`)
      .then(res => {
        if (res.status === 204) {
          alert('Note was deleted')
          getNotes()
        } else {
          alert('Failed to delete note.')
        }
      })
      .catch(err => alert(err))
  }

  const createNote = e => {
    e.preventDefault()
    api
      .post('/api/notes/', { content, title })
      .then(res => {
        if (res.status === 201) {
          alert('Note created!')
          getNotes()
        } else {
          alert('Failed to make note!')
        }
      })
      .catch(err => alert(err))
  }
  return (
    <div>
      <div>
        <h2>Notes</h2>
        {notes.map(note => (
          <NoteDetails note={note} onDelete={deleteNote} key={note.id} />
        ))}
      </div>
      <div>
        <h2>Create a Note</h2>
        <form onSubmit={createNote}>
          <label htmlFor='title'>Title: </label>
          <br />
          <input
            type='text'
            id='title'
            name='title'
            required
            onChange={e => setTitle(e.target.value)}
          />
          <label htmlFor='content'>Content: </label>
          <br />
          <textarea
            id='content'
            name='content'
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <input type='submit' value='Submit' />
        </form>
      </div>
    </div>
  )
}

export default Home
