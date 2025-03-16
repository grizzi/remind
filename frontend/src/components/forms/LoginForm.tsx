import { useState } from 'react'
import api from '../../api/api'
import { Link, useNavigate } from 'react-router'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'

function LoginForm({ method }: { method: 'login' | 'register' }) {
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
      if (method === 'login') {
        res = await api.post<AuthResponse>('/api/token/', {
          username,
          password,
        })
        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        navigate('/subscriptions') // go home
      }

      if (method === 'register') {
        try {
          await api.post('/api/register/', { username, password })
          navigate('/login') // if we just registered, then we have to login to access the webapp
        } catch (error: any) {
          if (error.response) {
            console.error('Error response:', error.response.data)
            alert(JSON.stringify(error.response.data)) // Show API error details
          } else if (error.request) {
            console.error('No response received:', error.request)
            alert('No response from server. Please try again.')
          } else {
            console.error('Error:', error.message)
            alert(error.message)
          }
        }
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
    <div className=''>
      <form className='flex flex-col items-center' onSubmit={handleSubmit}>
        <p className='text-xl m-6'>{name}</p>
        <input
          className=''
          type='text'
          value={username}
          onChange={e => setUserName(e.target.value)}
          placeholder='Username'
        />
        <input
          className=''
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Password'
        />
        <button className='' type='submit'>
          {name}
        </button>
        {method === 'login' && <Link to='/register'>Register</Link>}
      </form>
    </div>
  )
}

export default LoginForm
