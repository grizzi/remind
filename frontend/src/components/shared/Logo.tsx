// The logo is transparent text with colored background with a gradeient from one color to another
// the bg-clip-text make the background be clipped to the text, so that the background is imprinted on the
// text without showing outside of the text itself

const Logo = () => {
  return (
    <p
      className='bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-3xl
        font-extrabold text-transparent'
    >
      reMind
    </p>
  )
}

export default Logo
