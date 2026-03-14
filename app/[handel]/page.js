
import Link from "next/link";
import clientPromise from "@/lib/magodb";
import { notFound } from "next/navigation";
export default async function Page({ params }) {
  const { handel } = await params;
   const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    const item = await collection.findOne({handel:handel})
    if(!item){
      notFound()
    }
  const item2 = {
    _id: {
      $oid: "69b54799fd40b26df9e6b625",
    },
    handel: "Talhakhan",
    picture:"data:image/jpeg;base64,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",
    links: [
      {
        name: "facebook",
        url: "facebook.com",
      },
      {
        name: "youtube",
        url: "https://www.youtube.com/",
      },
    ],
  };
  return (
    <div className="flex min-h-screen  justify-center bg-cyan-800">
      <div className=" photo gap-4 flex justify-center items-center flex-col absolute top-70  rounded-full">
        <img
          className="rounded-full  my-5 "
          width={150}
          src={item.picture}
        ></img>

        <span className="font-bold my-10 text-white text-2xl ">
          @{item.handel}
        </span>
        <div className="links">
          {item.links.map((item,index) =>{
            return    <Link href={item.url}  key={index} ><div className="py-4 shadow-2xl my-3 px-50 bg-slate-800 rounded-md text-white">
           {item.name}
              
            </div></Link>
          }) }
        </div>
      </div>
    </div>
  );
}
