import clientPromise from "@/lib/magodb"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query || query.trim() === "") {
    return Response.json({ success: true, results: [] })
  }

  try {
    const client = await clientPromise
    const db = client.db("bittree")
    const collection = db.collection("links")

    // Search for handles that match the query (case insensitive)
    const results = await collection
      .find({
        handle: { $regex: query, $options: "i" }
      })
      .limit(10)
      .toArray()

    return Response.json({ success: true, results })
  } catch (error) {
    console.error("Search error:", error)
    return Response.json({ success: false, error: error.message })
  }
}
