import { useState } from 'react'
import { Navigate } from 'react-router'
import api from '../../api/api'
import { Link } from 'react-router'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
import axios, { AxiosError, AxiosResponse } from 'axios'
import TimedParagraph from '../shared/TimedParagraph'

interface LoginError {
  reason: string
  when: number
}

function LoginForm() {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<LoginError>()
  const [isRegistered, setIsRegistered] = useState<boolean>(false)
  const [isLoggedId, setIsLoggedIn] = useState<boolean>(false)

  interface AuthResponse {
    access: string
    refresh: string
  }

  const login = () => {
    api
      .post<AuthResponse>('/api/token/', {
        username,
        password,
      })
      .then((res: AxiosResponse<AuthResponse>) => {
        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh)
        setIsLoggedIn(true)
        setError(undefined)
      })
      .catch((error: Error | AxiosError) => {
        let errorMessage = 'Failed to login!'
        if (axios.isAxiosError(error)) {
          if (error.status && error.status === 401) {
            errorMessage += ' Invalid username or password!'
          } else if (error.response) {
            errorMessage += ' ' + JSON.stringify(error.response.data)
          }
        }
        setError({ reason: errorMessage, when: Date.now() })
        console.log(errorMessage)
      })
  }

  const register = (username: string, password: string) => {
    api
      .post('/api/register/', { username, password })
      .then(() => {
        setIsRegistered(true)
        setError(undefined)
      })
      .catch((error: Error | AxiosError) => {
        let errorMessage = 'Failed to register!'
        if (axios.isAxiosError(error)) {
          if (error.response) {
            errorMessage += ' ' + JSON.stringify(error.response.data)
          }
        }
        setError({ reason: errorMessage, when: Date.now() })
      })
  }

  if (isLoggedId) {
    return <Navigate to='/subscriptions' />
  }

  return (
    <div className=''>
      <div className='flex flex-col items-center'>
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

        <div className='flex'>
          <button
            className='m-4 p-1 w-full w-min-12 border-0 shadow-lg rounded-xs'
            type='button'
            onClick={() => login()}
          >
            Login
          </button>
          <Link
            className='m-4 p-1 w-full w-min-12 border-0 bg-purple-500 text-white rounded-xs shadow-lg'
            to='/register'
            onClick={() => register(username, password)}
          >
            Register
          </Link>
        </div>

        {error && (
          <TimedParagraph
            variant='error'
            key={error.when}
            text={error.reason}
          />
        )}

        {isRegistered && (
          <TimedParagraph
            variant='success'
            text='You successfully registered!'
          />
        )}
      </div>
    </div>
  )
}

export default LoginForm
