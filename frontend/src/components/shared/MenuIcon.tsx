import { IconType } from 'react-icons/lib'
import { Link } from 'react-router-dom'

const MenuIcon = ({ Icon, to }: { Icon: IconType; to: string }) => {
  return (
    <div
      className='dark:flex dark:items-center dark:justify-center dark:rounded-full dark:shadow-lg transition-all duration-300
                     dark:bg-gradient-to-br dark:from-blue-400 dark:to-purple-500 dark:text-white
                     dark:hover:from-blue-500 dark:hover:to-purple-600 dark:hover:shadow-xl
                     dark:focus:outline-none dark:focus:ring-4 dark:focus:ring-blue-300
                     dark:group'
    >
      <Link to={to}>
        <div className='p-3 text-purple-600 dark:text-white hover:text-purple-200 transition-all'>
          <Icon className='size-5' />
        </div>
      </Link>
    </div>
  )
}

export default MenuIcon
