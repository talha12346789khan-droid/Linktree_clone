"use client"
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const [text, setText] = useState("");
  
  const createTree = () => {
    if (!text.trim()) {
      alert("Please enter a handle");
      return;
    }
    router.push(`/generate?handle=${text}`)
  }

  return (
   <main>
    <section className="bg-[#d2e823] min-h-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0  px-4 md:px-0">
   
    <div className="flex flex-col justify-center md:ml-[10vw] mt-50">
      <p className="text-cyan-800 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">A link in bio </p>
      <p className="text-cyan-800 text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">built for you.</p>
      <p className="text-cyan-800 text-base md:text-lg lg:text-xl my-4 font-semibold leading-relaxed">50M+ people using linktree for their link in bio. One link to help you share everything you create, curate and sell from your Instagram, Tiktok, Youtube or other social media profiles. </p>
      <div className="input flex flex-col sm:flex-row gap-2 mt-4">
        <input 
          value={text} 
          onChange={(e)=>setText(e.target.value)} 
          onKeyPress={(e) => e.key === 'Enter' && createTree()}
          className="px-4 py-3 focus:outline-cyan-800 rounded-md border border-b-cyan-700 flex-1 text-sm md:text-base" 
          type="text" 
          placeholder="Enter your handle"
        ></input>
        <button 
          onClick={()=>createTree()} 
          className="bg-slate-600 text-white rounded-full py-3 px-6 md:px-8 font-semibold hover:bg-slate-700 hover:cursor-pointer transition w-full sm:w-auto text-sm md:text-base"
        >
          Claim your linktree
        </button>
      </div>
    </div>
    
    <div className="flex flex-col justify-center items-center md:mr-[10vw] mt-8 md:mt-0">
      <Image 
        src="/images/home.png" 
        width={400}
        height={400}
        alt="Linktree home" 
        priority
        className="w-full max-w-md md:max-w-full h-auto"
      />
    </div>
    </section>
   
   </main>
  );
}
