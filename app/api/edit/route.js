import clientPromise from "@/lib/magodb"
import { auth } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function PUT(request) {
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

    // Find the handle and verify ownership
    const existingHandle = await collection.findOne({ handel: body.handel })

    if (!existingHandle) {
      return Response.json({
        success: false,
        error: true,
        message: "Handle not found!",
        result: null
      })
    }

    // Check if user owns this handle
    if (existingHandle.userId !== session.user.id) {
      return Response.json({
        success: false,
        error: true,
        message: "You don't have permission to edit this handle!",
        result: null
      }, { status: 403 })
    }

    // Update existing document by handel
    const result = await collection.updateOne(
      { handel: body.handel },
      {
        $set: {
          picture: body.picture,
          links: body.links,
          updatedAt: new Date()
        }
      }
    )

    if (result.matchedCount === 0) {
      return Response.json({
        success: false,
        error: true,
        message: "Handle not found!",
        result: null
      })
    }

    return Response.json({
      success: true,
      error: false,
      message: "Profile updated successfully!",
      result: result
    })

  } catch (error) {
    console.error("Edit error:", error)

    return Response.json({
      success: false,
      error: true,
      message: error.message
    })
  }
}

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

    const { searchParams } = new URL(request.url)
    const handel = searchParams.get("handel")

    if (!handel) {
      return Response.json({
        success: false,
        error: true,
        message: "Handle parameter required",
        result: null
      })
    }

    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    const item = await collection.findOne({
      handel: { $regex: `^${handel}$`, $options: "i" }
    })

    if (!item) {
      return Response.json({
        success: false,
        error: true,
        message: "Handle not found",
        result: null
      })
    }

    // Check if user owns this handle
    if (item.userId !== session.user.id) {
      return Response.json({
        success: false,
        error: true,
        message: "You don't have permission to edit this handle!",
        result: null
      }, { status: 403 })
    }

    return Response.json({
      success: true,
      error: false,
      message: "Handle found",
      result: item
    })

  } catch (error) {
    console.error("Get error:", error)

    return Response.json({
      success: false,
      error: true,
      message: error.message
    })
  }
}
