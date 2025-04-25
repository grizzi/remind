import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/auth'
import { useNavigate } from 'react-router'

function RegisterForm() {
  const [username, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { logout, registerUser } = useAuth()

  const navigate = useNavigate()

  useEffect(() => {
    logout()
  }, [])

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col p-2 rounded-md justify-start'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center mb-10'>
            <p className='text-2xl'>Try reMind - It's free!</p>
          </div>
          <label className='text-gray-600' htmlFor='username'>
            Username
          </label>
          <input
            className='mb-2 border-1 border-gray-200 p-1'
            type='text'
            value={username}
            onChange={e => setUserName(e.target.value)}
            id='username'
            placeholder=''
          />
          <label className='text-gray-600' htmlFor='email'>
            Email
          </label>
          <input
            className='mb-2 border-1 border-gray-200 p-1'
            type='text'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder=''
            id='email'
          />
          <label className='text-gray-600' htmlFor='email'>
            Password
          </label>
          <input
            className='mb-2 border-1 border-gray-200 p-1'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder=''
            id='password'
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

      <div className='w-full flex items-center my-6'>
        <div className='flex-grow h-px bg-gray-400' />
        <span className='mx-4 text-gray-600 whitespace-nowrap'>or</span>
        <div className='flex-grow h-px bg-gray-400' />
      </div>

      <div className='mt-6'>
        <p>
          You already have an account?{' '}
          <a
            className='text-purple-600 hover:text-purple-500 hover:cursor-pointer font-semibold'
            onClick={() => navigate('/login')}
          >
            login here!
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
