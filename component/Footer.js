const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-300 py-6 mt-20 text-center border-t border-gray-800'>
      <div className='max-w-6xl mx-auto px-4'>
        <p className='text-sm md:text-base'>
          © {new Date().getFullYear()} <span className='text-purple-400 font-bold'>Linktree</span> created by <span className='text-pink-400 font-bold'>Talha Khan</span>
        </p>
        <p className='text-xs md:text-sm text-gray-500 mt-2'>
          All rights reserved. Share your links, build your presence.
        </p>
      </div>
    </footer>
  )
}

export default Footer
