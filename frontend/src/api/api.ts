import axios from 'axios'
import { ACCESS_TOKEN } from '../constants'

import { User, Note } from './types'

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(ACCESS_TOKEN)
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` }
    }
    return config
  },
  // TODO: I have to read about async JS
  error => {
    return Promise.reject(error)
  },
)

export namespace Api {
  export const login = async (user: User) => {
    return await api.post('/api/token/', user)
  }

  export const fetchNotes = (onNotes: (notes: Note[]) => void) => {
    api
      .get<Note[]>('/api/notes/')
      .then(res => {
        onNotes(res.data)
        console.log(JSON.stringify(res.data))
      })
      .catch(error => {
        console.error('Error fetching notes:', error)
      })
  }
}

export default api
