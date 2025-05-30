import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/auth'
import { useNavigate } from 'react-router'

function RegisterForm() {
  const [username, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  const { logout, registerUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    logout()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError(null)
    registerUser(username, password, email)
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col p-2 rounded-md justify-start'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center mb-10'>
            <p className='text-2xl'>Try reMind - It's free!</p>
          </div>
          <form
            className='flex flex-col items-center mb-10'
            onSubmit={handleSubmit}
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
              id='username'
              placeholder=''
            />

            <label className='w-full text-left text-gray-600' htmlFor='email'>
              Email
            </label>
            <input
              className='mb-2 border-1 border-gray-200 p-1'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              id='email'
              placeholder=''
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
              onChange={e => setPassword(e.target.value)}
              id='password'
              placeholder=''
            />

            <label
              className='w-full text-left text-gray-600'
              htmlFor='confirmPassword'
            >
              Repeat Password
            </label>
            <input
              className='mb-2 border-1 border-gray-200 p-1'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              id='confirmPassword'
              placeholder=''
            />

            {error && <p className='text-red-500 mb-2'>{error}</p>}

            <button
              type='submit'
              className='m-4 p-2 w-full w-min-12 border-0 bg-purple-500 text-white rounded-md shadow-lg'
            >
              Register
            </button>
          </form>
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
            Login here!
          </a>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm
