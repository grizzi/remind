import { useState } from 'react'
import { Navigate } from 'react-router'
import api from '../../api/api'
import { Link } from 'react-router'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'
import axios, { AxiosError, AxiosResponse } from 'axios'
import TimedParagraph from '../shared/TimedParagraph'
import Logo from '../shared/Logo'

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
    <div className='flex flex-col shadow-2xl p-2 rounded-md justify-start'>
      <div className='flex flex-row justify-center mb-4'>
        <Logo />
      </div>
      <div className='flex flex-col'>
        <input
          className='mb-2 border-1 border-gray-200 p-1'
          type='text'
          value={username}
          onChange={e => setUserName(e.target.value)}
          placeholder='Enter username'
        />
        <input
          className='mb-2 border-1 border-gray-200 p-1'
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder='Enter password'
        />

        <div className='flex'>
          <button
            className='m-4 p-2 w-full w-min-12 border-0 shadow-lg rounded-md'
            type='button'
            onClick={() => login()}
          >
            Login
          </button>
          <button
            className='m-4 p-2 w-full w-min-12 border-0 bg-purple-500 text-white rounded-md shadow-lg'
            onClick={() => register(username, password)}
          >
            Register
          </button>
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
