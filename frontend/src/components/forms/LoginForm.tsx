import { useState } from 'react'
import { useAuth } from '../../hooks/auth'
import { useNavigate } from 'react-router'

function LoginForm() {
  const [username, setUserName] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { loginUser } = useAuth()
  const navigate = useNavigate()

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col p-2 rounded-md justify-start'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center mb-10'>
            <p className='text-2xl'>Welcome back to reMind</p>
            <p className='text-sm'>Login to your account</p>
          </div>
          <label className='text-gray-600' htmlFor='username'>
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
          <label className='text-gray-600' htmlFor='password'>
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

          <div className='flex'>
            <button
              className='m-4 p-2 w-full w-min-12 border-0 shadow-lg rounded-md'
              type='button'
              onClick={() => loginUser(username, password)}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <p>
          Don’t have an account yet?{' '}
          <a
            className='text-purple-600 hover:text-purple-500 hover:cursor-pointer font-semibold'
            onClick={() => navigate('/register')}
          >
            Sign up for free!
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
