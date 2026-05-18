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

    // Try to find the user's handle by userId first
    let userHandle = await collection.findOne({ userId: session.user.id })

    // If not found by userId, try by email (fallback for session changes)
    if (!userHandle && session.user.email) {
      userHandle = await collection.findOne({ userEmail: session.user.email })
    }

    if (!userHandle) {
      console.log(`No handle found for userId: ${session.user.id}, email: ${session.user.email}`)
      return Response.json({
        success: true,
        error: false,
        message: "No handle found for this user",
        result: null
      })
    }

    // Update userId if it was found by email but userId doesn't match
    if (userHandle.userId !== session.user.id) {
      console.log(`Updating userId for email ${session.user.email} from ${userHandle.userId} to ${session.user.id}`)
      await collection.updateOne(
        { _id: userHandle._id },
        { $set: { userId: session.user.id } }
      )
      userHandle.userId = session.user.id
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
