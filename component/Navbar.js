'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'
import { navMenus } from '@/lib/navMenus'
import { DesktopNavDropdown, MobileNavDropdown } from '@/component/NavDropdown'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userHandle, setUserHandle] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const searchRef = useRef(null)
  const profileRef = useRef(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Fetch user's handle and admin status on mount
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchUserHandle = async () => {
        try {
          const response = await fetch('/api/user/handle')
          const data = await response.json()
          if (data.success && data.result) {
            setUserHandle(data.result.handle)
          }
        } catch (error) {
          console.error('Error fetching user handle:', error)
        }
      }
      const fetchAdmin = async () => {
        try {
          const response = await fetch('/api/admin/check')
          const data = await response.json()
          setIsAdmin(!!data.isAdmin)
        } catch {
          setIsAdmin(false)
        }
      }
      fetchUserHandle()
      fetchAdmin()
    } else {
      setIsAdmin(false)
    }
  }, [status])

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

  const handleSearchSelect = (handle) => {
    router.push(`/${encodeURIComponent(handle)}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <ToastContainer />
      <nav className='fixed bg-white rounded-full md:rounded-full p-1 md:py-3 lg:py-4 mx-2 md:mx-0 w-[calc(100%-1rem)] md:w-[85vw] top-10 md:right-[7.5vw] md:left-auto left-0 flex justify-between items-center z-50'>
      {/* Logo */}
      <div className='logo flex items-center mx-0.5 md:mx-3 lg:mx-8 shrink-0'>
        <Link href="/">
          <Image 
            alt='logo' 
            src="https://cdn.prod.website-files.com/666255f7f2126f4e8cec6f8f/66634daccb34e6d65a41c76d_download.svg" 
            width={100}
            height={100}
            className='md:w-24 md:h-24 w-16 h-16'
          />
        </Link>
      </div>

      {/* Menu Items - Hidden on mobile, visible on md and up */}
      <div className='hidden md:flex items-center ml-6 lg:ml-10 flex-1'>
        <ul className='flex gap-2 lg:gap-8 text-base lg:text-lg cursor-pointer'>
          {navMenus.map((menu) => (
            <DesktopNavDropdown key={menu.key} menu={menu} />
          ))}
        </ul>
      </div>

      {/* Desktop Buttons - Hidden on mobile */}
      <div className='hidden md:flex buttons mr-1 md:mr-2 lg:mr-5 gap-1 md:gap-2 lg:gap-3 items-center'>
        {/* Search Bar */}
        <div ref={searchRef} className='relative'>
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className='cursor-pointer hover:bg-gray-200 p-1 md:p-1.5 lg:p-2 rounded-lg transition'
            aria-label='Search'
            title='Search handlers'
          >
            <svg className='w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
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
                  {searchResults
                    .sort((a, b) => {
                      // Prioritize exact match or user's own handle
                      if (userHandle) {
                        if (a.handle.toLowerCase() === userHandle.toLowerCase()) return -1
                        if (b.handle.toLowerCase() === userHandle.toLowerCase()) return 1
                      }
                      return 0
                    })
                    .map((result) => {
                      const isUserHandle = userHandle && result.handle.toLowerCase() === userHandle.toLowerCase()
                      return (
                        <li
                          key={result._id}
                          onClick={() => handleSearchSelect(result.handle)}
                          className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition border-b border-gray-100 flex items-center gap-2 ${
                            isUserHandle ? 'bg-blue-50 font-semibold' : ''
                          }`}
                        >
                          <span className='text-blue-600 font-medium'>@{result.handle}</span>
                          {isUserHandle && <span className='text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded'>Your Profile</span>}
                        </li>
                      )
                    })}
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
              className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-1 md:py-1.5 lg:py-2 px-2 md:px-2.5 lg:px-6 text-xs lg:text-base rounded-full hover:shadow-lg transition whitespace-nowrap'
            >
              <span className='hidden md:inline'>My Profile</span>
              <span className='md:hidden'>Profile</span>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className='absolute -right-4 md:right-0 top-12 w-56 md:w-64 bg-white shadow-2xl rounded-lg z-50 border border-gray-200 max-h-64 overflow-y-auto'>
                <div className='p-4 border-b border-gray-200'>
                  <p className='text-gray-600 text-sm'>Logged in as:</p>
                  <p className='text-purple-600 font-bold text-sm mt-1 truncate'>{session?.user?.email}</p>
                  {userHandle && (
                    <p className='text-gray-600 text-xs mt-2'>
                      Handle: <span className='font-bold text-blue-600'>@{userHandle}</span>
                    </p>
                  )}
                </div>
                <div className='p-3 space-y-2'>
                  {userHandle ? (
                    <button
                      onClick={() => {
                        router.push(`/${encodeURIComponent(userHandle)}`)
                        setIsProfileOpen(false)
                      }}
                      className='w-full text-left px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded transition font-semibold text-sm'
                    >
                      👁️ View My Profile
                    </button>
                  ) : (
                    <div className='w-full px-4 py-2 bg-yellow-50 text-yellow-700 rounded text-sm'>
                      <p className='font-semibold mb-2'>⚠️ No Handle Found</p>
                      <p className='text-xs mb-3'>You need to create a handle first to view your profile.</p>
                      <Link href="/generate">
                        <button className='w-full text-center px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-xs font-semibold transition'>
                          Create Handle
                        </button>
                      </Link>
                    </div>
                  )}
                  <Link href="/generate">
                    <button className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition text-sm'>
                      ✏️ My Links
                    </button>
                  </Link>
                  <Link href="/support">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition text-sm'
                    >
                      🆘 Support
                    </button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin/support">
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className='w-full text-left px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded transition text-sm font-semibold'
                      >
                        👑 Admin inbox
                      </button>
                    </Link>
                  )}
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
            className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-1 md:py-1.5 lg:py-2 px-2 md:px-2.5 lg:px-6 text-xs lg:text-base rounded-full hover:shadow-lg transition whitespace-nowrap'
          >
            Sign In
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        className='md:hidden mr-2 flex flex-col gap-1 cursor-pointer'
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label='Toggle menu'
      >
        <span className={`block w-5 h-0.5 bg-black transition ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-black transition ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-5 h-0.5 bg-black transition ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className='absolute top-full left-2 right-2 bg-white shadow-lg rounded-2xl mt-1.5 md:hidden max-h-[calc(100vh-120px)] overflow-y-auto'>
          <div className='p-3 border-b border-gray-200 sticky top-0 bg-white'>
            <input
              type='text'
              placeholder='Search handlers...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              autoFocus
            />
            {isLoading && searchQuery && (
              <div className='p-2 text-center text-gray-500 text-xs'>Loading...</div>
            )}
            {searchQuery && searchResults.length > 0 ? (
              <ul className='max-h-48 overflow-y-auto mt-1.5'>
                {searchResults
                  .sort((a, b) => {
                    if (userHandle) {
                      if (a.handle.toLowerCase() === userHandle.toLowerCase()) return -1
                      if (b.handle.toLowerCase() === userHandle.toLowerCase()) return 1
                    }
                    return 0
                  })
                  .map((result) => {
                    const isUserHandle = userHandle && result.handle.toLowerCase() === userHandle.toLowerCase()
                    return (
                      <li
                        key={result._id}
                        onClick={() => {
                          handleSearchSelect(result.handle)
                          setIsMenuOpen(false)
                        }}
                        className={`px-2 py-1.5 cursor-pointer hover:bg-gray-100 transition border-b border-gray-100 text-xs ${
                          isUserHandle ? 'bg-blue-50 font-semibold' : ''
                        }`}
                      >
                        <span className='text-blue-600 font-medium'>@{result.handle}</span>
                        {isUserHandle && <span className='text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded ml-1'>Your Profile</span>}
                      </li>
                    )
                  })}
              </ul>
            ) : searchQuery && !isLoading ? (
              <div className='p-1.5 text-center text-gray-500 text-xs mt-1.5'>No handlers found</div>
            ) : null}
          </div>
          <ul className='flex flex-col p-2 gap-2 text-sm cursor-pointer'>
            {navMenus.map((menu) => (
              <MobileNavDropdown
                key={menu.key}
                menu={menu}
                onNavigate={() => setIsMenuOpen(false)}
              />
            ))}
            <hr className='my-1' />
            {status === 'authenticated' ? (
              <div className='px-2 py-1.5'>
                <div className='bg-purple-50 border border-purple-200 rounded-lg p-2 mb-2'>
                  <p className='text-gray-600 text-xs'>Logged in as:</p>
                  <p className='text-purple-600 font-bold text-xs mt-1 truncate'>{session?.user?.email}</p>
                </div>
                <Link href="/generate" className='block mb-1'>
                  <button className='cursor-pointer bg-slate-300 px-3 py-1 rounded text-xs w-full hover:bg-slate-400 transition'>
                    ✏️ My Links
                  </button>
                </Link>
                <Link href="/support" className='block mb-1' onClick={() => setIsMenuOpen(false)}>
                  <button className='cursor-pointer bg-slate-200 px-3 py-1 rounded text-xs w-full hover:bg-slate-300 transition'>
                    🆘 Support
                  </button>
                </Link>
                {isAdmin && (
                  <Link href="/admin/support" className='block mb-1' onClick={() => setIsMenuOpen(false)}>
                    <button className='cursor-pointer bg-purple-100 text-purple-800 px-3 py-1 rounded text-xs w-full hover:bg-purple-200 transition font-semibold'>
                      👑 Admin inbox
                    </button>
                  </Link>
                )}
                <button 
                  onClick={() => {
                    signOut({ callbackUrl: "/" })
                    setIsMenuOpen(false)
                  }}
                  className='cursor-pointer bg-red-600 text-white px-3 py-1 rounded text-xs w-full hover:bg-red-700 transition font-semibold'
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <div className='px-2 py-1.5'>
                <button 
                  onClick={() => signIn()}
                  className='cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-1 px-3 rounded-full text-xs w-full hover:shadow-lg transition'
                >
                  Sign In
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
    </>
  )
}

export default Navbar
