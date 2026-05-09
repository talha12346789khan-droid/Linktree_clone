import clientPromise from "@/lib/magodb"
import { auth } from "@/lib/auth"

export async function GET(request) {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return Response.json({
        success: false,
        error: true,
        message: "You must be logged in!",
        result: null
      }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    // Find the user's handle by their userId
    const userHandle = await collection.findOne({ userId: session.user.id })

    if (!userHandle) {
      return Response.json({
        success: true,
        error: false,
        message: "No handle found for this user",
        result: null
      })
    }

    return Response.json({
      success: true,
      error: false,
      message: "User handle found",
      result: userHandle
    })

  } catch (error) {
    console.error("Get user handle error:", error)

    return Response.json({
      success: false,
      error: true,
      message: error.message
    })
  }
}
