import { useState } from 'react'
import { useAuth } from '../hooks/auth'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { Api } from '../api/api'

function LoginForm() {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handlePasswordReset = () => {
    if (username.trim() === '') {
      toast.error('Please enter your username to reset your password.')
      return
    }

    Api.resetPasswordRequest(username)
      .then(() => {
        toast.success(
          'Password reset link sent to your email. Please check your inbox.',
        )
        navigate('/login')
      })
      .catch(error => {
        console.error('Password reset request failed:', error)
        toast.error('Failed to send password reset link. Please try again.')
      })
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col p-2 rounded-md justify-start'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center mb-10'>
            <p className='text-2xl'>Welcome back!</p>
            <p className='text-sm'>Login to your account</p>
          </div>
          <form
            className='flex flex-col items-center mb-10'
            onSubmit={e => {
              e.preventDefault()
              loginUser(username, password)
            }}
          >
            <label
              className='w-full text-left text-gray-600'
              htmlFor='username'
            >
              Username
            </label>
            <input
              className='mb-2 border-1 border-gray-200 p-1'
              type='text'
              value={username}
              onChange={e => setUserName(e.target.value)}
              placeholder=''
              id='username'
            />
            <label
              className='w-full text-left text-gray-600'
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='mb-2 border-1 border-gray-200 p-1'
              type='password'
              value={password}
              id='password'
              onChange={e => setPassword(e.target.value)}
              placeholder=''
            />

            <button
              className='m-4 p-2 w-full w-min-12 border-0 shadow-lg rounded-md'
              type='submit'
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <div className='mt-6 flex flex-col items-center'>
        <p>
          Don’t have an account yet?{' '}
          <a
            className='text-purple-600 hover:text-purple-500 hover:cursor-pointer font-semibold'
            onClick={() => navigate('/register')}
          >
            Sign up for free!
          </a>
        </p>
        <p className='mt-2'>
          Password lost in the multiverse?{' '}
          <a
            className='text-purple-300 hover:cursor-pointer'
            onClick={() => handlePasswordReset()}
          >
            Send me a reset link
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
