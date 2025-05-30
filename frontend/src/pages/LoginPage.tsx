import LoginForm from '../forms/LoginForm'
import Logo from '../components/shared/Logo'

export const LoginPage = () => {
  return (
    <div className='px-6 pt-8 flex flex-col items-center'>
      <Logo />
      <LoginForm />
    </div>
  )
}

export default LoginPage
