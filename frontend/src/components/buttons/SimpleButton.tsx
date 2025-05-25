export default function SimpleButton({
  text,
  type,
}: {
  text?: string
  type: 'submit' | 'button'
}) {
  return (
    <button
      className='items-center justify-center w-24 h-10 bg-purple-600 text-white rounded-sm shadow-lg md:bg-purple-300 hover:bg-purple-600 transition-all'
      aria-label={`Button: ${text}`}
      type={type}
    >
      {text}
    </button>
  )
}
