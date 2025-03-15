import { useState } from 'react'
import api from '../../api/api'
import { useNavigate } from 'react-router'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'

function LoginForm({
  route,
  method,
}: {
  route: string
  method: 'login' | 'register'
}) {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const name: string = method === 'login' ? 'Login' : 'Register'

  interface AuthResponse {
    access: string
    refresh: string
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    let res = undefined
    try {
      res = await api.post<AuthResponse>(route, { username, password })
      if (method === 'login') {
        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        navigate('/') // go home
      } else {
        navigate('/login') // if we just registered, then we have to login to access the webapp
      }
    } catch (error) {
      alert(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className='form-container'>
      <h1>{name}</h1>
      <input
        className='form-input'
        type='text'
        value={username}
        onChange={e => setUserName(e.target.value)}
        placeholder='Username'
      />
      <input
        className='form-input'
        type='password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='Password'
      />
      <button className='form-button' type='submit'>
        {name}
      </button>
    </form>
  )
}

export default LoginForm
