import clientPromise from "@/lib/magodb"


export async function POST(request) {
    const body = await request.json()
    console.log(body)
    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    const doc = await collection.findOne({handel: body.handel})
    
    if(doc){
        return Response.json({success: false, error: true, message: 'This handle already exists!', result: null})
    }

    // New handle, insert with all links
    const result = await collection.insertOne({
        handel: body.handel,
        picture: body.picture,
        links: body.links
    })

    return Response.json({success:true, error:false, message:'Profile created with all links!', result:result})
}