import { IconType } from 'react-icons/lib'
import { Link } from 'react-router-dom'

const MenuIcon = ({ Icon, to }: { Icon: IconType; to: string }) => {
  return (
    <div>
      <Link to={to}>
        <Icon className='px-2 size-10 text-purple-700 hover:text-purple-200 transition-all' />
      </Link>
    </div>
  )
}

export default MenuIcon
