import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Api } from '../api/api'
import { Link } from 'react-router-dom'

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
    }
    setActivationStatus('success')

    activateAccount()
  }, [uidb64, token])

  if (!activationStatus) {
    return <></>
  }

  return (
    <div className='p-6 max-w-md mx-auto text-center bg-white rounded-xl shadow-md'>
      {activationStatus === 'success' ? (
        <>
          <h2 className='text-2xl font-semibold text-green-600'>
            Account Activated!
          </h2>
          <Link to='/login'>Login</Link>
        </>
      ) : (
        <>
          <h2 className='text-2xl font-semibold text-red-600'>
            Activation Failed
          </h2>
          <p className='mt-2'>The activation link is invalid or has expired.</p>
        </>
      )}
    </div>
  )
}

export default ActivationPage
