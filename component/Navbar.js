import React from 'react'
import Image from 'next/image'
const Navbar = () => {
  return (
  <nav className='fixed bg-white rounded-full py-8 w-[80vw]  top-10 right-[10vw] flex justify-between '>
    <div className='logo flex items-center mx-10 '> <Image alt='logo' src="https://cdn.prod.website-files.com/666255f7f2126f4e8cec6f8f/66634daccb34e6d65a41c76d_download.svg" width={135} height={135}></Image>

     <div className='flex items-center ml-10'>
         <ul className='flex gap-8 text-lg cursor-pointer  '>
            <li className='text-xl hover:font-bold'>Product</li>
            <li className='text-xl hover:font-bold'>Templates</li>
            <li className='text-xl hover:font-bold'>Marketplace</li>
            <li className='text-xl hover:font-bold'>Learn</li>
            <li className='text-xl hover:font-bold'>Pricing</li>
            
        </ul>
        </div>
    </div>
   
      
        <div className='buttons mr-5 '>
            <button className='cursor-pointer bg-slate-300  px-5 py-2 rounded-lg mx-5'>Sign In</button>
            <button className='cursor-pointer bg-black text-white px-5 py-2 rounded-full'>Sing up free</button>
        </div>
    
   
  </nav>
  )
}

export default Navbar
