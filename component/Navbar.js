'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { toast, ToastContainer } from 'react-toastify'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isProductDropdown, setIsProductDropdown] = useState(false)
  const [isTemplatesDropdown, setIsTemplatesDropdown] = useState(false)
  const [isMarketplaceDropdown, setIsMarketplaceDropdown] = useState(false)
  const [isLearnDropdown, setIsLearnDropdown] = useState(false)
  const [isPricingDropdown, setIsPricingDropdown] = useState(false)
  // Mobile dropdown states
  const [isMobileProductDropdown, setIsMobileProductDropdown] = useState(false)
  const [isMobileTemplatesDropdown, setIsMobileTemplatesDropdown] = useState(false)
  const [isMobileMarketplaceDropdown, setIsMobileMarketplaceDropdown] = useState(false)
  const [isMobileLearnDropdown, setIsMobileLearnDropdown] = useState(false)
  const [isMobilePricingDropdown, setIsMobilePricingDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [userHandle, setUserHandle] = useState(null)
  const searchRef = useRef(null)
  const profileRef = useRef(null)
  const productRef = useRef(null)
  const templatesRef = useRef(null)
  const marketplaceRef = useRef(null)
  const learnRef = useRef(null)
  const pricingRef = useRef(null)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Fetch user's handle on mount
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
      fetchUserHandle()
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
      if (productRef.current && !productRef.current.contains(event.target)) {
        setIsProductDropdown(false)
      }
      if (templatesRef.current && !templatesRef.current.contains(event.target)) {
        setIsTemplatesDropdown(false)
      }
      if (marketplaceRef.current && !marketplaceRef.current.contains(event.target)) {
        setIsMarketplaceDropdown(false)
      }
      if (learnRef.current && !learnRef.current.contains(event.target)) {
        setIsLearnDropdown(false)
      }
      if (pricingRef.current && !pricingRef.current.contains(event.target)) {
        setIsPricingDropdown(false)
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
          <li 
            ref={productRef}
            onMouseEnter={() => setIsProductDropdown(true)}
            onMouseLeave={() => setIsProductDropdown(false)}
            className='relative group'
          >
            <button
              className='text-lg md:text-xl hover:font-bold transition flex items-center gap-2'
            >
              Product
              <svg className={`w-4 h-4 transition-transform ${isProductDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </button>
            
            {isProductDropdown && (
              <div 
                onMouseEnter={() => setIsProductDropdown(true)}
                onMouseLeave={() => setIsProductDropdown(false)}
                className='absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50'>
                <ul className='py-2'>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>📱 Mobile App</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🌐 Web Platform</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🔧 Tools & Extensions</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer border-t'>📚 Documentation</li>
                </ul>
              </div>
            )}
          </li>

          <li 
            ref={templatesRef}
            onMouseEnter={() => setIsTemplatesDropdown(true)}
            onMouseLeave={() => setIsTemplatesDropdown(false)}
            className='relative group'
          >
            <button
              className='text-lg md:text-xl hover:font-bold transition flex items-center gap-2'
            >
              Templates
              <svg className={`w-4 h-4 transition-transform ${isTemplatesDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </button>
            
            {isTemplatesDropdown && (
              <div 
                onMouseEnter={() => setIsTemplatesDropdown(true)}
                onMouseLeave={() => setIsTemplatesDropdown(false)}
                className='absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50'>
                <ul className='py-2'>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🎨 Creative</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>💼 Business</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🎵 Music & Audio</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer border-t'>🎬 Video & Media</li>
                </ul>
              </div>
            )}
          </li>

          <li 
            ref={marketplaceRef}
            onMouseEnter={() => setIsMarketplaceDropdown(true)}
            onMouseLeave={() => setIsMarketplaceDropdown(false)}
            className='relative group'
          >
            <button
              className='text-lg md:text-xl hover:font-bold transition flex items-center gap-2'
            >
              Marketplace
              <svg className={`w-4 h-4 transition-transform ${isMarketplaceDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </button>
            
            {isMarketplaceDropdown && (
              <div 
                onMouseEnter={() => setIsMarketplaceDropdown(true)}
                onMouseLeave={() => setIsMarketplaceDropdown(false)}
                className='absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50'>
                <ul className='py-2'>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🎯 Featured</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>⭐ Top Rated</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🆕 New Releases</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer border-t'>💎 Premium</li>
                </ul>
              </div>
            )}
          </li>

          <li 
            ref={learnRef}
            onMouseEnter={() => setIsLearnDropdown(true)}
            onMouseLeave={() => setIsLearnDropdown(false)}
            className='relative group'
          >
            <button
              className='text-lg md:text-xl hover:font-bold transition flex items-center gap-2'
            >
              Learn
              <svg className={`w-4 h-4 transition-transform ${isLearnDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </button>
            
            {isLearnDropdown && (
              <div 
                onMouseEnter={() => setIsLearnDropdown(true)}
                onMouseLeave={() => setIsLearnDropdown(false)}
                className='absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50'>
                <ul className='py-2'>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>📖 Tutorials</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🎓 Courses</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>❓ FAQ</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer border-t'>🆘 Support</li>
                </ul>
              </div>
            )}
          </li>

          <li 
            ref={pricingRef}
            onMouseEnter={() => setIsPricingDropdown(true)}
            onMouseLeave={() => setIsPricingDropdown(false)}
            className='relative group'
          >
            <button
              className='text-lg md:text-xl hover:font-bold transition flex items-center gap-2'
            >
              Pricing
              <svg className={`w-4 h-4 transition-transform ${isPricingDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
              </svg>
            </button>
            
            {isPricingDropdown && (
              <div 
                onMouseEnter={() => setIsPricingDropdown(true)}
                onMouseLeave={() => setIsPricingDropdown(false)}
                className='absolute left-0 mt-0 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50'>
                <ul className='py-2'>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🆓 Free Plan</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>⭐ Starter</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer'>🚀 Pro</li>
                  <li onClick={() => window.open('#', '_blank')} className='px-4 py-2 hover:bg-gray-100 transition cursor-pointer border-t'>👑 Enterprise</li>
                </ul>
              </div>
            )}
          </li>
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
        <div className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-2xl mt-2 md:hidden max-h-[calc(100vh-120px)] overflow-y-auto'>
          <div className='p-4 border-b border-gray-200 sticky top-0 bg-white'>
            <input
              type='text'
              placeholder='Search handlers...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              autoFocus
            />
            {isLoading && searchQuery && (
              <div className='p-2 text-center text-gray-500 text-sm'>Loading...</div>
            )}
            {searchQuery && searchResults.length > 0 ? (
              <ul className='max-h-64 overflow-y-auto mt-2'>
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
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-100 transition border-b border-gray-100 text-sm ${
                          isUserHandle ? 'bg-blue-50 font-semibold' : ''
                        }`}
                      >
                        <span className='text-blue-600 font-medium'>@{result.handle}</span>
                        {isUserHandle && <span className='text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded ml-2'>Your Profile</span>}
                      </li>
                    )
                  })}
              </ul>
            ) : searchQuery && !isLoading ? (
              <div className='p-2 text-center text-gray-500 text-sm mt-2'>No handlers found</div>
            ) : null}
          </div>
          <ul className='flex flex-col p-4 gap-4 text-lg cursor-pointer'>
            {/* Product Dropdown Mobile */}
            <li className='text-lg px-4 py-2 hover:bg-gray-100 rounded'>
              <button 
                onClick={() => setIsMobileProductDropdown(!isMobileProductDropdown)}
                className='w-full text-left flex justify-between items-center hover:font-bold transition'
              >
                <span>Product</span>
                <svg className={`w-4 h-4 transition-transform ${isMobileProductDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
              </button>
              {isMobileProductDropdown && (
                <div className='mt-2 bg-gray-50 rounded-lg overflow-hidden'>
                  <ul className='py-2'>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileProductDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>📱 Mobile App</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileProductDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🌐 Web Platform</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileProductDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🔧 Tools & Extensions</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileProductDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base border-t'>📚 Documentation</li>
                  </ul>
                </div>
              )}
            </li>

            {/* Templates Dropdown Mobile */}
            <li className='text-lg px-4 py-2 hover:bg-gray-100 rounded'>
              <button 
                onClick={() => setIsMobileTemplatesDropdown(!isMobileTemplatesDropdown)}
                className='w-full text-left flex justify-between items-center hover:font-bold transition'
              >
                <span>Templates</span>
                <svg className={`w-4 h-4 transition-transform ${isMobileTemplatesDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
              </button>
              {isMobileTemplatesDropdown && (
                <div className='mt-2 bg-gray-50 rounded-lg overflow-hidden'>
                  <ul className='py-2'>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileTemplatesDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🎨 Creative</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileTemplatesDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>💼 Business</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileTemplatesDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🎵 Music & Audio</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileTemplatesDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base border-t'>🎬 Video & Media</li>
                  </ul>
                </div>
              )}
            </li>

            {/* Marketplace Dropdown Mobile */}
            <li className='text-lg px-4 py-2 hover:bg-gray-100 rounded'>
              <button 
                onClick={() => setIsMobileMarketplaceDropdown(!isMobileMarketplaceDropdown)}
                className='w-full text-left flex justify-between items-center hover:font-bold transition'
              >
                <span>Marketplace</span>
                <svg className={`w-4 h-4 transition-transform ${isMobileMarketplaceDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
              </button>
              {isMobileMarketplaceDropdown && (
                <div className='mt-2 bg-gray-50 rounded-lg overflow-hidden'>
                  <ul className='py-2'>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileMarketplaceDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🎯 Featured</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileMarketplaceDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>⭐ Top Rated</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileMarketplaceDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🆕 New Releases</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileMarketplaceDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base border-t'>💎 Premium</li>
                  </ul>
                </div>
              )}
            </li>

            {/* Learn Dropdown Mobile */}
            <li className='text-lg px-4 py-2 hover:bg-gray-100 rounded'>
              <button 
                onClick={() => setIsMobileLearnDropdown(!isMobileLearnDropdown)}
                className='w-full text-left flex justify-between items-center hover:font-bold transition'
              >
                <span>Learn</span>
                <svg className={`w-4 h-4 transition-transform ${isMobileLearnDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
              </button>
              {isMobileLearnDropdown && (
                <div className='mt-2 bg-gray-50 rounded-lg overflow-hidden'>
                  <ul className='py-2'>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileLearnDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>📖 Tutorials</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileLearnDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🎓 Courses</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileLearnDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>❓ FAQ</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobileLearnDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base border-t'>🆘 Support</li>
                  </ul>
                </div>
              )}
            </li>

            {/* Pricing Dropdown Mobile */}
            <li className='text-lg px-4 py-2 hover:bg-gray-100 rounded'>
              <button 
                onClick={() => setIsMobilePricingDropdown(!isMobilePricingDropdown)}
                className='w-full text-left flex justify-between items-center hover:font-bold transition'
              >
                <span>Pricing</span>
                <svg className={`w-4 h-4 transition-transform ${isMobilePricingDropdown ? 'rotate-180' : ''}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
                </svg>
              </button>
              {isMobilePricingDropdown && (
                <div className='mt-2 bg-gray-50 rounded-lg overflow-hidden'>
                  <ul className='py-2'>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobilePricingDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🆓 Free Plan</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobilePricingDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>⭐ Starter</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobilePricingDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base'>🚀 Pro</li>
                    <li onClick={() => { window.open('#', '_blank'); setIsMobilePricingDropdown(false) }} className='px-4 py-2 hover:bg-gray-200 transition text-base border-t'>👑 Enterprise</li>
                  </ul>
                </div>
              )}
            </li>
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
    </>
  )
}

export default Navbar
