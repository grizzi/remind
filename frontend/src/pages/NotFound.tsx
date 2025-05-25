import { Link } from 'react-router-dom'
import Logo from '../components/shared/Logo'

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center mt-12'>
      <div className='mb-12'>
        <Link to='/subscriptions'>
          <Logo />
        </Link>
      </div>
      <p className='text-2xl'>Ooops</p>
      <p>The page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound
