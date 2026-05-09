import clientPromise from "@/lib/magodb"
import { auth } from "@/lib/auth"

export async function POST(request) {
  try {
    // Get session to verify user is authenticated
    const session = await auth()
    
    if (!session || !session.user) {
      return Response.json({
        success: false,
        error: true,
        message: "You must be logged in!",
        result: null
      }, { status: 401 })
    }

    const body = await request.json()
    console.log(body)

    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    // Check if handel already exists
    const doc = await collection.findOne({ handel: body.handel })

    if (doc) {
      return Response.json({
        success: false,
        error: true,
        message: "This handel already exists!",
        result: null
      })
    }

    // Insert new document with user info
    const result = await collection.insertOne({
      handel: body.handel,
      picture: body.picture,
      links: body.links,
      userId: session.user.id,
      userEmail: session.user.email,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    return Response.json({
      success: true,
      error: false,
      message: "Profile created with all links!",
      result: result
    })

  } catch (error) {
    console.error("Add error:", error)

    return Response.json({
      success: false,
      error: true,
      message: error.message
    })
  }
}