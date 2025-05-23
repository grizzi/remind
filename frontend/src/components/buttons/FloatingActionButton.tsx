import { FaPlus } from 'react-icons/fa'

const FloatingActionButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className='fixed border-0 bottom-8 right-6 flex items-center justify-center size-20 bg-purple-300 text-white rounded-full shadow-lg hover:bg-purple-600 transition-all'
      aria-label='Add new entry'
      onClick={onClick}
    >
      <FaPlus className='size-8' />
    </button>
  )
}

export default FloatingActionButton
