"use client"
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
    const [text, setText] = useState("");
  const createTree = () => {
   
router.push(`/generate?handel=${text}`)

}

  return (
   <main>
    <section className="bg-[#d2e823] min-h-[100vh] grid grid-cols-2">
   
    <div className="  flex flex-col justify-center  ml-[10vw]">
      <p className= "text-cyan-800 text-7xl font-bold">A link in bio </p>
      <p className= "text-cyan-800 text-7xl font-bold">built for you.</p>
      <p className= "text-cyan-800 text-xl my-4 font-semibold">50M+ people using linktree for their link in bio.One link to help you share everything you create,curate and sell from your Instagram, Tiktok, Youtube or other social media profiles. </p>
      <div className="input">
        <input value={text} onChange={(e)=>setText(e.target.value)} className="px-3 py-3 focus:outline-cyan-800 rounded-md border border-b-cyan-700" type="text" placeholder="Enter your handel"></input>
        <button onClick={()=>createTree()} className="bg-slate-600 text-white rounded-full py-3 px-3 mx-2 font-semibold hover:cursor-pointer">Claim your linktree</button>
      </div>
    </div>
    <div className=" text-yellow-400 text-5xl flex flex-col justify-center items-center mr-[10vw]">
      <img src="images/home.png" width={600}></img>
    </div>
    </section>
    <section className="bg-[#e82337] min-h-[100vh]">
   
   
    
    </section>
   </main>
  );
}
