'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef(null)
  const profileRef = useRef(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Search handles as user types
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const handleSearch = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        if (data.success) {
          setSearchResults(data.results)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSelect = (handel) => {
    router.push(`/${handel}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <nav className='fixed bg-white rounded-full md:rounded-full p-2 md:py-4 w-full md:w-[80vw] top-10 md:right-[10vw] md:left-auto left-0 flex justify-between items-center z-50'>
      {/* Logo */}
      <div className='logo flex items-center mx-2 md:mx-8 shrink-0'>
        <Link href="/">
          <Image 
            alt='logo' 
            src="https://cdn.prod.website-files.com/666255f7f2126f4e8cec6f8f/66634daccb34e6d65a41c76d_download.svg" 
            width={100}
            height={100}
            className='md:w-24 md:h-24 w-20 h-20'
          />
        </Link>
      </div>

      {/* Menu Items - Hidden on mobile, visible on md and up */}
      <div className='hidden md:flex items-center ml-10 flex-1'>
        <ul className='flex gap-8 text-lg cursor-pointer'>
          <li className='text-lg md:text-xl hover:font-bold transition'>Product</li>
          <li className='text-lg md:text-xl hover:font-bold transition'>Templates</li>
          <li className='text-lg md:text-xl hover:font-bold transition'>Marketplace</li>
          <li className='text-lg md:text-xl hover:font-bold transition'>Learn</li>
          <li className='text-lg md:text-xl hover:font-bold transition'>Pricing</li>
        </ul>
      </div>

      {/* Desktop Buttons - Hidden on mobile */}
      <div className='hidden md:flex buttons mr-5 gap-3 items-center'>
        {/* Search Bar */}
        <div ref={searchRef} className='relative'>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className='cursor-pointer hover:bg-gray-200 p-2 rounded-lg transition'
            aria-label='Search'
            title='Search handlers'
          >
            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
          </button>

          {isSearchOpen && (
            <div className='absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-50 border border-gray-200'>
              <input
                type='text'
                placeholder='Search handlers...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full px-4 py-2 border-b border-gray-200 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                autoFocus
              />
              {isLoading && (
                <div className='p-4 text-center text-gray-500'>Loading...</div>
              )}
              {searchQuery && searchResults.length > 0 ? (
                <ul className='max-h-64 overflow-y-auto'>
                  {searchResults.map((result) => (
                    <li
                      key={result._id}
                      onClick={() => handleSearchSelect(result.handel)}
                      className='px-4 py-3 cursor-pointer hover:bg-gray-100 transition border-b border-gray-100 flex items-center gap-2'
                    >
                      <span className='text-blue-600 font-medium'>@{result.handel}</span>
                    </li>
                  ))}
                </ul>
              ) : searchQuery && !isLoading ? (
                <div className='p-4 text-center text-gray-500 text-sm'>No handlers found</div>
              ) : null}
            </div>
          )}
        </div>

        {status === 'authenticated' ? (
          <div ref={profileRef} className='relative'>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition'
            >
              My Profile
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className='absolute right-0 top-12 w-64 bg-white shadow-2xl rounded-lg z-50 border border-gray-200 max-h-64 overflow-y-auto'>
                <div className='p-4 border-b border-gray-200'>
                  <p className='text-gray-600 text-sm'>Logged in as:</p>
                  <p className='text-purple-600 font-bold text-sm mt-1 truncate'>{session?.user?.email}</p>
                </div>
                <div className='p-3 space-y-2'>
                  <Link href="/generate">
                    <button className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition text-sm'>
                      ✏️ My Links
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" })
                      setIsProfileOpen(false)
                    }}
                    className='w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded transition font-semibold text-sm'
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button 
            onClick={() => signIn()}
            className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-6 rounded-full hover:shadow-lg transition'
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className='md:hidden mr-4 flex flex-col gap-1.5 cursor-pointer'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label='Toggle menu'
      >
        <span className={`block w-6 h-0.5 bg-black transition ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black transition ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black transition ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl mt-2 md:hidden'>
          <div className='p-4 border-b border-gray-200'>
            <input
              type='text'
              placeholder='Search handlers...'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <ul className='flex flex-col p-4 gap-4 text-lg cursor-pointer'>
            <li className='text-lg hover:font-bold transition px-4 py-2 hover:bg-gray-100 rounded'>Product</li>
            <li className='text-lg hover:font-bold transition px-4 py-2 hover:bg-gray-100 rounded'>Templates</li>
            <li className='text-lg hover:font-bold transition px-4 py-2 hover:bg-gray-100 rounded'>Marketplace</li>
            <li className='text-lg hover:font-bold transition px-4 py-2 hover:bg-gray-100 rounded'>Learn</li>
            <li className='text-lg hover:font-bold transition px-4 py-2 hover:bg-gray-100 rounded'>Pricing</li>
            <hr className='my-2' />
            {status === 'authenticated' ? (
              <div className='px-4 py-3'>
                <div className='bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3'>
                  <p className='text-gray-600 text-xs'>Logged in as:</p>
                  <p className='text-purple-600 font-bold text-sm mt-1 truncate'>{session?.user?.email}</p>
                </div>
                <Link href="/generate" className='block mb-2'>
                  <button className='cursor-pointer bg-slate-300 px-5 py-2 rounded-lg w-full hover:bg-slate-400 transition'>
                    ✏️ My Links
                  </button>
                </Link>
                <button 
                  onClick={() => {
                    signOut({ callbackUrl: "/" })
                    setIsMenuOpen(false)
                  }}
                  className='cursor-pointer bg-red-600 text-white px-5 py-2 rounded-lg w-full hover:bg-red-700 transition font-semibold'
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className='px-4 py-3'>
                <button 
                  onClick={() => signIn()}
                  className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2 px-6 rounded-full w-full hover:shadow-lg transition'
                >
                  Sign In
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar
