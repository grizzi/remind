const TagChip = ({ name }: { name: string }) => {
  return (
    <div className='flex m-1 min-w-14 rounded-lg shadow-md px-3 justify-center bg-purple-200'>
      <p className='m-0 p-0'>{name}</p>
    </div>
  )
}

export default TagChip
