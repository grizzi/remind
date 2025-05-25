import React from 'react'

const DropDownMenu = ({
  outerDivRef,
  onEdit,
  onDelete,
}: {
  outerDivRef: React.RefObject<HTMLDivElement | null>
  onEdit: () => void
  onDelete: () => void
}) => {
  return (
    <div
      ref={outerDivRef}
      className='absolute top-10 right-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32'
    >
      <button
        onClick={e => {
          e.stopPropagation()
          onEdit()
        }}
        className='w-full px-4 py-2 text-left text-sm hover:bg-gray-100'
      >
        Edit
      </button>
      <button
        onClick={e => {
          e.stopPropagation()
          onDelete()
        }}
        className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50'
      >
        Delete
      </button>
    </div>
  )
}

export default DropDownMenu
