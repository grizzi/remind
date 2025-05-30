import { Navigate, useParams } from 'react-router'
import PasswordResetForm from '../components/forms/PasswordResetForm'
import Logo from '../components/shared/Logo'
import { toast } from 'react-toastify'
import { Api } from '../api/api'
import { useState } from 'react'

export const PasswordPage = () => {
  const [success, setSuccess] = useState<boolean | null>(false)

  const { uidb64, token } = useParams()
  if (!uidb64 || !token) {
    return <p className='text-red-500'>Invalid reset link</p>
  }

  const onSubmit = async (password: string) => {
    Api.resetPassword(uidb64, token, password)
      .then(() => setSuccess(true))
      .catch(error => {
        console.error('Password reset failed:', error)
        toast.error('Password reset failed. Please try again.')
      })
  }

  if (success) {
    return <Navigate to='/login' replace={true} />
  }

  return (
    <div className='px-6 pt-8 flex flex-col items-center'>
      <Logo />
      <PasswordResetForm onSubmit={onSubmit} />
    </div>
  )
}

export default PasswordPage
