import clientPromise from "@/lib/magodb"


export async function POST(request) {
    const body = await request.json()
    console.log(body)
    const client = await clientPromise
     const db = client.db("bittree")
    const collection = db.collection("links")

       const doc = await collection.findOne({handel: body.handel})
    if(doc){
        return Response.json({success: false, error: true,  message: 'This bitree already exists!', result:null, })
    }

    const result = await collection.insertOne(body)

    return Response.json({success:true, error:false,
     message:'Added ', result:result,} )
}