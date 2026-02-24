import Image from "next/image";

export default function Home() {
  return (
   <main>
    <section className="bg-[#d2e823] min-h-[100vh] grid grid-cols-2">
   
    <div className="  flex flex-col justify-center  ml-[10vw]">
      <p className= "text-cyan-800 text-7xl font-bold">Everything you </p>
      <p className= "text-cyan-800 text-7xl font-bold"> are. in one,</p>
      <p className= "text-cyan-800 text-7xl font-bold">simple link bio.</p>
      <p className= "text-cyan-800 text-xl my-4">50M+ people using linktree for their link in bio.One link to help you share everything you create,curate and sell from your Instagram, Tiktok, Youtube or other social media profiles. </p>
      <div className="input">
        <input className="px-2 py-2 focus:outline-cyan-800 rounded-md border border-b-cyan-700" type="text" placeholder="linktr.ee/your-link"></input>
        <button className="bg-slate-600 text-white rounded-full py-3 px-3 mx-2 font-semibold">Claim your linktree</button>
      </div>
    </div>
    <div className=" text-yellow-400 text-5xl flex flex-col justify-center items-center mr-[10vw]">jgjhnm</div>
    </section>
    <section className="bg-[#e82337] min-h-[100vh]">
   
    
    </section>
   </main>
  );
}
