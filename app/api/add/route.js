import clientPromise from "@/lib/magodb"
import { auth } from "@/lib/auth"
import { assertNotBanned } from "@/lib/banned"
import { linksForSave } from "@/lib/profileLinks"
import { DEFAULT_TEMPLATE_ID, isValidTemplateId } from "@/lib/templates"

export async function POST(request) {
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
    const templateId = isValidTemplateId(body.templateId)
      ? body.templateId
      : DEFAULT_TEMPLATE_ID
    const description = (body.description || "").trim().slice(0, 500)
    const links = linksForSave(body.links)

    if (!body.handle?.trim()) {
      return Response.json({
        success: false,
        message: "Handle is required",
      }, { status: 400 })
    }

    if (links.filter((l) => l.enabled).length === 0) {
      return Response.json({
        success: false,
        message: "Add at least one enabled link with name and URL",
      }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    const doc = await collection.findOne({ handle: body.handle })

    if (doc) {
      return Response.json({
        success: false,
        error: true,
        message: "This handle already exists!",
        result: null
      })
    }

    const userHandle = await collection.findOne({ userId: session.user.id })

    if (userHandle) {
      return Response.json({
        success: false,
        error: true,
        message: "You already have a handle! You can only have one handle per account. Please edit your existing handle instead.",
        result: null
      })
    }

    const result = await collection.insertOne({
      handle: body.handle.trim(),
      picture: body.picture || "",
      description,
      templateId,
      links,
      userId: session.user.id,
      userEmail: session.user.email,
      analytics: { profileViews: 0, linkClicks: {} },
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
