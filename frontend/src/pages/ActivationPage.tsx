import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Api } from '../api/api'
import { Link } from 'react-router-dom'
import Logo from '../components/shared/Logo'

const ActivationPage = () => {
  const { uidb64, token } = useParams()
  const [activationStatus, setActivationStatus] = useState<
    null | 'success' | 'error'
  >(null) // 'success' | 'error' | null

  useEffect(() => {
    const activateAccount = async () => {
      try {
        // Replace with your actual API endpoint
        await Api.activateAccount(uidb64!, token!)
      } catch (error) {
        console.error('Activation error:', error)
        setActivationStatus('error')
      }
      setActivationStatus('success')
    }

    activateAccount()
      .then(() => {
        setActivationStatus('success')
      })
      .catch(error => {
        console.error('Activation failed:', error)
        setActivationStatus('error')
      })
  }, [uidb64, token])

  if (!activationStatus) {
    return <></>
  }

  return (
    <div className='px-6 pt-8 flex flex-col items-center'>
      <Logo />
      <div className='flex flex-col items-center justify-center mt-12'>
        {activationStatus === 'success' ? (
          <>
            <p className='text-2xl text-green-600'>Account Activated!</p>
            <div className='mt-2 text-purple-600 hover:text-purple-500 hover:cursor-pointer font-semibold'>
              <Link to='/login'>Login</Link>
            </div>
          </>
        ) : (
          <>
            <p className='text-2xl font-semibold text-red-600'>
              Activation Failed
            </p>
            <p className='mt-2'>
              The activation link is invalid or has expired.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default ActivationPage
