import { Outlet } from 'react-router'
import { Link } from 'react-router-dom'

const SiteLayout = () => {
  return (
    <div>
      <h1>reMind</h1>
      <ul className='nav'>
        <li>
          <Link to='/subscriptions'>My Subscriptions</Link>
        </li>
        <li>
          <Link to='/settings'>Settings</Link>
        </li>
        <li>
          <Link to='/logout'>Logout</Link>
        </li>
      </ul>

      <Outlet />
    </div>
  )
}

export default SiteLayout
