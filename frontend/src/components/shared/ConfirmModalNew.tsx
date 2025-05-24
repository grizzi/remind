import {
  Dialog,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
} from '@headlessui/react'
import { Fragment, useState } from 'react'

export default function ConfirmDeleteModal({
  onDelete,
}: {
  onDelete: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='fixed border-0 bottom-8 right-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
      >
        Delete Account
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as='div'
          className='relative z-10'
          onClose={() => setIsOpen(false)}
        >
          {/* Backdrop */}
          <TransitionChild
            as={Fragment}
            enter='ease-out duration-700'
            enterFrom='opacity-0'
          >
            <div className='fixed inset-0 bg-black opacity-70' />
          </TransitionChild>

          {/* Modal panel wrapper */}
          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-4 text-center'>
              <TransitionChild
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-90 scale-100'
              >
                <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all opacity-100'>
                  <DialogTitle
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900'
                  >
                    Confirm Account Deletion
                  </DialogTitle>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500'>
                      Are you sure you want to delete your account? This action
                      cannot be undone.
                    </p>
                  </div>

                  <div className='mt-4 flex justify-end gap-2'>
                    <button
                      onClick={() => setIsOpen(false)}
                      className='px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200'
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onDelete()
                        setIsOpen(false)
                      }}
                      className='px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700'
                    >
                      Delete
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
