import RegisterForm from '../components/forms/RegisterForm'
import Logo from '../components/shared/Logo'

export const RegisterPage = () => {
  return (
    <div className='px-6 pt-8 flex flex-col items-center'>
      <Logo />
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
