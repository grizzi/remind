import {
  MdOutlineSubscriptions,
  MdOutlineAutoGraph,
  MdOutlineLogout,
} from 'react-icons/md'
import { FaRegCalendarAlt } from 'react-icons/fa'
import { JSX } from 'react'
import { Link } from 'react-router-dom'

const SidebarIcon = ({ icon, path }: { icon: JSX.Element; path: string }) => {
  return (
    <Link to={path}>
      <div className='flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto bg-gray-400 hover:bg-green-400 hover:rounded-xl rounded-3xl trasition-all duration-300 ease-in-out cursor-pointer shadow-lg'>
        {icon}
      </div>
    </Link>
  )
}

const Sidebar = () => {
  return (
    <aside className='top-0 left-0 h-screen w-16 transition-transform flex flex-col bg-white shadow-lg'>
      <SidebarIcon icon={<MdOutlineSubscriptions size='28' />} path='/' />
      <Divider />
      <SidebarIcon icon={<MdOutlineAutoGraph size='28' />} path='/overview' />
      <SidebarIcon icon={<FaRegCalendarAlt size='28' />} path='/calendar' />
      <SidebarIcon icon={<MdOutlineLogout size='28' />} path='/logout' />
    </aside>
  )
}

const Divider = () => <hr className='sidebar-hr' />

export default Sidebar
