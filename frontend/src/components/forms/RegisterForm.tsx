import { useState } from 'react'
import Logo from '../shared/Logo'
import { useAuth } from '../../hooks/auth'
import { useNavigate } from 'react-router'

function RegisterForm() {
  const [username, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { registerUser } = useAuth()

  const navigate = useNavigate()

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col shadow-xl p-2 rounded-md justify-start'>
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
            type='text'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='Enter email'
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
              className='m-4 p-2 w-full w-min-12 border-0 bg-purple-500 text-white rounded-md shadow-lg'
              onClick={() => registerUser(username, password, email)}
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <div className='m-6'>or</div>

      <button
        className='m-4 p-2 w-full w-min-12 border-0 shadow-lg rounded-md'
        type='button'
        onClick={() => navigate('/login')}
      >
        Login
      </button>
    </div>
  )
}

export default RegisterForm
