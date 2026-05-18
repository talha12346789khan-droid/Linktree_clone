import clientPromise from "@/lib/magodb"
import { auth } from "@/lib/auth"

export async function DELETE(request) {
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
    console.log("Delete request:", body)

    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    // Find the handle and verify ownership
    const existingHandle = await collection.findOne({ handle: body.handle })

    if (!existingHandle) {
      return Response.json({
        success: false,
        error: true,
        message: "Handle not found!",
        result: null
      })
    }

    // Check if user owns this handle
    // Allow if userId matches, or if email matches (for session changes)
    if (existingHandle.userId !== session.user.id && existingHandle.userEmail !== session.user.email) {
      return Response.json({
        success: false,
        error: true,
        message: "You don't have permission to delete this handle!",
        result: null
      }, { status: 403 })
    }

    // Update userId if it was found by email but userId doesn't match
    if (existingHandle.userId !== session.user.id) {
      await collection.updateOne(
        { handle: body.handle },
        { $set: { userId: session.user.id } }
      )
    }

    // Delete the document
    const result = await collection.deleteOne({ handle: body.handle })

    if (result.deletedCount === 0) {
      return Response.json({
        success: false,
        error: true,
        message: "Failed to delete handle!",
        result: null
      })
    }

    return Response.json({
      success: true,
      error: false,
      message: "Handle deleted successfully!",
      result: result
    })

  } catch (error) {
    console.error("Delete error:", error)

    return Response.json({
      success: false,
      error: true,
      message: error.message
    })
  }
}
