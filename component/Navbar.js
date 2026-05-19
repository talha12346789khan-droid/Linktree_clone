'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'
import { navMenus } from '@/lib/navMenus'
import { DesktopNavDropdown, MobileNavDropdown } from '@/component/NavDropdown'

function SearchIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
    </svg>
  )
}

function SearchSpinner() {
  return (
    <svg className='h-4 w-4 animate-spin text-purple-600' viewBox='0 0 24 24' fill='none' aria-hidden>
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
    </svg>
  )
}

function SearchResultsList({ searchQuery, searchResults, isLoading, userHandle, onSelect, compact }) {
  if (!searchQuery.trim()) {
    return (
      <p className={`text-center text-gray-400 ${compact ? 'py-4 text-xs' : 'py-6 text-sm'}`}>
        Type a handle to find profiles
      </p>
    )
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center gap-2 text-gray-500 ${compact ? 'py-4 text-xs' : 'py-8 text-sm'}`}>
        <SearchSpinner />
        <span>Searching...</span>
      </div>
    )
  }

  if (searchResults.length === 0) {
    return (
      <div className={`text-center ${compact ? 'py-4 px-2' : 'py-8 px-4'}`}>
        <div className={`mx-auto mb-2 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 ${compact ? 'h-10 w-10' : 'h-12 w-12'}`}>
          <SearchIcon className={compact ? 'h-5 w-5' : 'h-6 w-6'} />
        </div>
        <p className={`font-medium text-gray-700 ${compact ? 'text-xs' : 'text-sm'}`}>No profiles found</p>
        <p className={`mt-0.5 text-gray-400 ${compact ? 'text-[10px]' : 'text-xs'}`}>
          Try another handle or spelling
        </p>
      </div>
    )
  }

  const sorted = [...searchResults].sort((a, b) => {
    if (userHandle) {
      if (a.handle.toLowerCase() === userHandle.toLowerCase()) return -1
      if (b.handle.toLowerCase() === userHandle.toLowerCase()) return 1
    }
    return 0
  })

  return (
    <ul className={`overflow-y-auto ${compact ? 'max-h-44' : 'max-h-72'}`}>
      {sorted.map((result) => {
        const isUserHandle =
          userHandle && result.handle.toLowerCase() === userHandle.toLowerCase()
        const initial = (result.handle?.[0] || '?').toUpperCase()
        return (
          <li key={result._id}>
            <button
              type='button'
              onClick={() => onSelect(result.handle)}
              className={`group flex w-full items-center gap-3 text-left transition ${
                compact ? 'px-3 py-2.5' : 'px-4 py-3'
              } ${
                isUserHandle
                  ? 'bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100'
                  : 'hover:bg-gray-50'
              }`}
            >
              <span
                className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-bold text-white shadow-sm ${
                  compact ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
                }`}
              >
                {initial}
              </span>
              <span className='min-w-0 flex-1'>
                <span
                  className={`block truncate font-semibold text-gray-900 group-hover:text-purple-700 ${
                    compact ? 'text-sm' : 'text-base'
                  }`}
                >
                  @{result.handle}
                </span>
                {isUserHandle && (
                  <span className='mt-0.5 inline-block rounded-full bg-purple-200/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-800'>
                    Your profile
                  </span>
                )}
              </span>
              <svg
                className={`shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-purple-500 ${
                  compact ? 'h-4 w-4' : 'h-5 w-5'
                }`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                aria-hidden
              >
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function SearchInput({ value, onChange, onClear, compact, inputRef }) {
  return (
    <div className={`relative flex items-center ${compact ? '' : ''}`}>
      <span className={`pointer-events-none absolute text-gray-400 ${compact ? 'left-3' : 'left-4'}`}>
        <SearchIcon className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
      </span>
      <input
        ref={inputRef}
        type='search'
        placeholder='Search @handles...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border-0 bg-gray-50 font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 ${
          compact
            ? 'rounded-xl py-2.5 pl-9 pr-9 text-sm'
            : 'rounded-xl py-3 pl-11 pr-10 text-sm'
        }`}
        autoComplete='off'
        autoCorrect='off'
        spellCheck='false'
      />
      {value && (
        <button
          type='button'
          onClick={onClear}
          className={`absolute rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-600 ${
            compact ? 'right-2' : 'right-3'
          }`}
          aria-label='Clear search'
        >
          <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>
      )}
    </div>
  )
}

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
  const searchInputRef = useRef(null)
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

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const clearSearch = () => setSearchQuery('')

  const handleSearchSelect = (handle) => {
    router.push(`/${encodeURIComponent(handle)}`)
    setIsSearchOpen(false)
    setIsMenuOpen(false)
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
        {/* Search */}
        <div ref={searchRef} className='relative'>
          <button
            type='button'
            onClick={() => setIsSearchOpen((open) => !open)}
            className={`flex items-center justify-center rounded-full p-2 transition ${
              isSearchOpen
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-purple-700'
            }`}
            aria-label='Search profiles'
            aria-expanded={isSearchOpen}
          >
            <SearchIcon className='h-5 w-5' />
          </button>

          {isSearchOpen && (
            <div
              className='absolute right-0 top-full z-50 mt-3 w-[min(100vw-2rem,22rem)] rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-purple-500/10 ring-1 ring-black/5'
              role='dialog'
              aria-label='Search profiles'
            >
              <div className='rounded-t-2xl border-b border-gray-100 bg-gradient-to-r from-purple-50/80 to-pink-50/80 px-4 py-3'>
                <p className='text-xs font-semibold uppercase tracking-wider text-purple-700'>Find a profile</p>
                <p className='mt-0.5 text-[11px] text-gray-500'>Search by @handle</p>
              </div>
              <div className='p-3'>
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onClear={clearSearch}
                  inputRef={searchInputRef}
                />
              </div>
              <div className='border-t border-gray-100'>
                <SearchResultsList
                  searchQuery={searchQuery}
                  searchResults={searchResults}
                  isLoading={isLoading}
                  userHandle={userHandle}
                  onSelect={handleSearchSelect}
                />
              </div>
              <p className='rounded-b-2xl border-t border-gray-50 px-3 py-2 text-center text-[10px] text-gray-400'>
                Esc to close
              </p>
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
                  <Link href="/analytics">
                    <button
                      onClick={() => setIsProfileOpen(false)}
                      className='w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition text-sm'
                    >
                      📊 Analytics
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
                    <>
                      <Link href="/admin/support">
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className='w-full text-left px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded transition text-sm font-semibold'
                        >
                          👑 Admin inbox
                        </button>
                      </Link>
                      <Link href="/admin/moderation">
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className='w-full text-left px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded transition text-sm font-semibold'
                        >
                          🛡️ Moderation
                        </button>
                      </Link>
                      <Link href="/admin/stats">
                        <button
                          onClick={() => setIsProfileOpen(false)}
                          className='w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded transition text-sm font-semibold'
                        >
                          📊 Site stats
                        </button>
                      </Link>
                    </>
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
          <div className='sticky top-0 z-10 border-b border-gray-100 bg-gradient-to-r from-purple-50/80 to-pink-50/80 p-3'>
            <p className='mb-2 text-xs font-semibold uppercase tracking-wider text-purple-700'>
              Find a profile
            </p>
            <SearchInput
              compact
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={clearSearch}
            />
            <div className='mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm'>
              <SearchResultsList
                compact
                searchQuery={searchQuery}
                searchResults={searchResults}
                isLoading={isLoading}
                userHandle={userHandle}
                onSelect={handleSearchSelect}
              />
            </div>
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
                <Link href="/analytics" className='block mb-1' onClick={() => setIsMenuOpen(false)}>
                  <button className='cursor-pointer bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-xs w-full hover:bg-indigo-200 transition font-semibold'>
                    📊 Analytics
                  </button>
                </Link>
                <Link href="/support" className='block mb-1' onClick={() => setIsMenuOpen(false)}>
                  <button className='cursor-pointer bg-slate-200 px-3 py-1 rounded text-xs w-full hover:bg-slate-300 transition'>
                    🆘 Support
                  </button>
                </Link>
                {isAdmin && (
                  <>
                    <Link href="/admin/support" className='block mb-1' onClick={() => setIsMenuOpen(false)}>
                      <button className='cursor-pointer bg-purple-100 text-purple-800 px-3 py-1 rounded text-xs w-full hover:bg-purple-200 transition font-semibold'>
                        👑 Admin inbox
                      </button>
                    </Link>
                    <Link href="/admin/moderation" className='block mb-1' onClick={() => setIsMenuOpen(false)}>
                      <button className='cursor-pointer bg-red-100 text-red-800 px-3 py-1 rounded text-xs w-full hover:bg-red-200 transition font-semibold'>
                        🛡️ Moderation
                      </button>
                    </Link>
                    <Link href="/admin/stats" className='block mb-1' onClick={() => setIsMenuOpen(false)}>
                      <button className='cursor-pointer bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-xs w-full hover:bg-indigo-200 transition font-semibold'>
                        📊 Site stats
                      </button>
                    </Link>
                  </>
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
