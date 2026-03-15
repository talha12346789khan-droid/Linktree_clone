
import Link from "next/link";
import clientPromise from "@/lib/magodb";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { handel } = await params;
  const client = await clientPromise
  const db = client.db("bittree")
  const collection = db.collection("links")

  // Case-insensitive search for handel
  const item = await collection.findOne({ 
    handel: { $regex: `^${handel}$`, $options: "i" } 
  })
  if (!item) {
    notFound()
  }

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
          {item.links.map((linkItem, index) => {
            return <Link href={linkItem.url} key={index} ><div className="py-4 shadow-2xl my-3 px-50 bg-slate-800 rounded-md text-white">
              {linkItem.name}
            </div></Link>
          }) }
        </div>
      </div>
    </div>
  );
}
