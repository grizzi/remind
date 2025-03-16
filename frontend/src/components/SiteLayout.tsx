import { Outlet } from 'react-router'
import { TbLogout, TbSettings, TbHome } from 'react-icons/tb'
import Logo from './shared/Logo'
import MenuIcon from './shared/MenuIcon'
import { Link } from 'react-router-dom'

const SiteLayout = () => {
  return (
    <div className='px-6 pt-8'>
      <div className='mb-8 flex justify-between items-center'>
        <Link to='/subscriptions'>
          <Logo />
        </Link>
        <div className='flex flex-row w-max-40 '>
          <MenuIcon to='/subscriptions' Icon={TbHome} />
          <MenuIcon to='/settings' Icon={TbSettings} />
          <MenuIcon to='/logout' Icon={TbLogout} />
        </div>
      </div>

      <Outlet />
    </div>
  )
}

export default SiteLayout
