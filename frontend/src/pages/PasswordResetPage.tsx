import PasswordResetForm from '../components/forms/PasswordResetForm'
import Logo from '../components/shared/Logo'

export const PasswordPage = () => {
  return (
    <div className='px-6 pt-8 flex flex-col items-center'>
      <Logo />
      <PasswordResetForm />
    </div>
  )
}

export default PasswordPage
