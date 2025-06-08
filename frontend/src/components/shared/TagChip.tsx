const TagChip = ({
  name,
  disabled = false,
  onClick = () => {},
}: {
  name: string
  disabled?: boolean
  onClick?: () => void
}) => {
  const color = disabled ? 'bg-gray-300 text-white dark:text-gray-600' : 'bg-purple-500 text-white'
  return (
    <div
      onClick={onClick}
      className={`flex m-1 rounded-sm shadow-md justify-center
              px-1 py-0.5 text-sm min-w-[2.5rem]
              sm:px-3 sm:py-1.5 sm:text-base sm:min-w-14
              ${color}`}
    >
      <p className='text-xs'>{name}</p>
    </div>
  )
}

export default TagChip
