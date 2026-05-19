import clientPromise from "@/lib/magodb"
import { auth } from "@/lib/auth"
import { assertNotBanned } from "@/lib/banned"
import { linksForSave } from "@/lib/profileLinks"
import { isValidTemplateId } from "@/lib/templates"

export async function PUT(request) {
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

    const banMsg = await assertNotBanned(session)
    if (banMsg) {
      return Response.json({ success: false, message: banMsg }, { status: 403 })
    }

    const body = await request.json()
    const links = linksForSave(body.links)
    const description = (body.description ?? "").trim().slice(0, 500)

    if (links.filter((l) => l.enabled).length === 0) {
      return Response.json({
        success: false,
        message: "You need at least one enabled link with name and URL",
      }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    const existingHandle = await collection.findOne({ handle: body.handle })

    if (!existingHandle) {
      return Response.json({
        success: false,
        error: true,
        message: "Handle not found!",
        result: null
      })
    }

    if (existingHandle.userId !== session.user.id) {
      return Response.json({
        success: false,
        error: true,
        message: "You don't have permission to edit this handle!",
        result: null
      }, { status: 403 })
    }

    const updateFields = {
      picture: body.picture || "",
      description,
      links,
      updatedAt: new Date(),
    }

    if (body.templateId && isValidTemplateId(body.templateId)) {
      updateFields.templateId = body.templateId
    }

    const result = await collection.updateOne(
      { handle: body.handle },
      { $set: updateFields }
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
    const handle = searchParams.get("handle")

    if (!handle) {
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
      handle: { $regex: `^${handle}$`, $options: "i" }
    })

    if (!item) {
      return Response.json({
        success: false,
        error: true,
        message: "Handle not found",
        result: null
      })
    }

    if (item.userId !== session.user.id && item.userEmail !== session.user.email) {
      return Response.json({
        success: false,
        error: true,
        message: "You don't have permission to edit this handle!",
        result: null
      }, { status: 403 })
    }

    if (item.userId !== session.user.id) {
      await collection.updateOne(
        { _id: item._id },
        { $set: { userId: session.user.id } }
      )
      item.userId = session.user.id
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
