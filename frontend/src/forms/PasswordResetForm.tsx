import { useState } from 'react'
import { toast } from 'react-toastify'

function PasswordResetForm({
  onSubmit,
}: {
  onSubmit: (password: string) => void
}) {
  const [password, setPassword] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')

  const handleSubmit = async () => {
    if (password !== password2) {
      toast('Passwords do not match')
      return
    }

    onSubmit(password)
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='flex flex-col p-2 rounded-md justify-start'>
        <div className='flex flex-col'>
          <div className='flex flex-col items-center mb-10'>
            <p className='text-sm'>Reset your password please</p>
          </div>
          <form
            className='flex flex-col items-center mb-10'
            onSubmit={e => {
              e.preventDefault()
              handleSubmit()
            }}
          >
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
              placeholder=''
              id='password'
            />

            <label
              className='w-full text-left text-gray-600'
              htmlFor='password2'
            >
              Repeat password
            </label>
            <input
              className='mb-2 border-1 border-gray-200 p-1'
              type='password'
              value={password2}
              onChange={e => setPassword2(e.target.value)}
              placeholder=''
              id='password2'
            />

            <button
              className='m-4 p-2 w-full w-min-12 border-0 shadow-lg rounded-md'
              type='submit'
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordResetForm
