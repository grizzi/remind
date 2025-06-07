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
      className='absolute top-10 right-3 z-10 w-32 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800'
    >
      <button
        onClick={e => {
          e.stopPropagation()
          onEdit()
        }}
        className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
      >
        Edit
      </button>
      <button
        onClick={e => {
          e.stopPropagation()
          onDelete()
        }}
        className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40'
      >
        Delete
      </button>
    </div>
  )
}

export default DropDownMenu
