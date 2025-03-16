const ConfirmModal = ({
  prompt,
  onOk,
  onDiscard,
}: {
  prompt: string
  onOk: () => void
  onDiscard: () => void
}) => {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 '>
      <div className='flex flex-col items-center justify-center bg-purple-100 shadow-2xl rounded-xl bg-opacity-50 h-full'>
        <div className='mb-2 text-center'>{prompt}</div>
        <div className='flex flex-row justify-evenly items-center w-full'>
          <button
            className='m-2 border-0 shadow-lg w-22 bg-white hover:bg-gray-300 rounded-xl transition-all'
            onClick={onOk}
          >
            Ok
          </button>
          <button
            className='m-2 border-0 shadow-lg w-22 bg-white hover:bg-gray-300 rounded-xl transition-all'
            onClick={onDiscard}
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
