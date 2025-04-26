const TagChip = ({
  name,
  disabled = false,
  onClick = () => {},
}: {
  name: string
  disabled?: boolean
  onClick?: () => void
}) => {
  const color = disabled ? 'bg-gray-300 text-white' : 'bg-purple-500 text-white'
  return (
    <div
      onClick={onClick}
      className={`flex m-1 min-w-14 rounded-sm shadow-md px-3 justify-center ${color}`}
    >
      <p className='m-0 p-0'>{name}</p>
    </div>
  )
}

export default TagChip
