import { useState, useEffect } from 'react'
import { TbMoon, TbSun } from 'react-icons/tb'

const DarkModeToggle = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      return savedTheme ? savedTheme : 'light'
    }
    return 'light'
  })

  useEffect(() => {
    const htmlElement = document.documentElement
    if (theme === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))
  }

  return (
    <button
      onClick={toggleTheme}
      className='flex items-center justify-center p-3 rounded-full shadow-lg transition-all duration-300
                     bg-gradient-to-br from-blue-400 to-purple-500 text-white
                     hover:from-blue-500 hover:to-purple-600 hover:shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-purple-800
                     group'
      aria-label='Toggle dark mode'
    >
      {theme === 'light' ? (
        <TbSun className='size-5' />
      ) : (
        <TbMoon className='size-5' />
      )}
    </button>
  )
}

export default DarkModeToggle
