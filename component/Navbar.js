import React from 'react'
import Image from 'next/image'
const Navbar = () => {
  return (
  <nav className='bg-white rounded-full py-5 w-[80vw] absolute top-10 right-[10vw] flex justify-between '>
    <div className='logo flex items-center mx-10 '> <Image alt='logo' src="https://cdn.prod.website-files.com/666255f7f2126f4e8cec6f8f/66634daccb34e6d65a41c76d_download.svg" width={150} height={150}></Image>

     <div className='flex items-center ml-10'>
         <ul className='flex gap-6 text-lg '>
            <li>Product</li>
            <li>Templates</li>
            <li>Marketplace</li>
            <li>Lern</li>
            <li>Pricing</li>
            
        </ul>
        </div>
    </div>
   
      
        <div className='buttons mr-5'>
            <button className='bg-slate-300  px-5 py-2 rounded-lg mx-5'>Sign In</button>
            <button className='bg-black text-white px-5 py-2 rounded-full'>Sing up free</button>
        </div>
    
   
  </nav>
  )
}

export default Navbar
