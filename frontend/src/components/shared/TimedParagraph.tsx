import { useEffect, useState } from 'react'

const TimedParagraph = ({
  text,
  variant,
}: {
  text: string
  variant: 'error' | 'success'
}) => {
  const [show, setShow] = useState(true)
  const [animateOut, setAnimateOut] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimateOut(true)
      setTimeout(() => setShow(false), 500)
    }, 3000)

    return () => clearTimeout(timeout)
  }, [text])

  let variantStyle = ''
  if (variant === 'error') {
    variantStyle = 'text-white bg-red-500'
  }
  if (variant === 'success') {
    variantStyle = 'text-white bg-green-500'
  }
  return (
    <>
      {show && (
        <p
          className={`text-center  p-4 rounded-lg shadow-md transition-all duration-500 ease-in-out 
          ${
            animateOut
              ? 'opacity-0 translate-x-20'
              : 'opacity-100 translate-x-0'
          }
          ${variantStyle}`}
        >
          {text}
        </p>
      )}
    </>
  )
}

export default TimedParagraph
