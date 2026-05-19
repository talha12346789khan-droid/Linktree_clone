import clientPromise from "@/lib/magodb";

function normalizeHandle(handle) {
  return handle?.trim().toLowerCase();
}

function isAllowedRedirectUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

async function resolveLink(handle, index) {
  const client = await clientPromise;
  const db = client.db("bittree");
  const collection = db.collection("links");

  const item = await collection.findOne({
    handle: { $regex: `^${handle}$`, $options: "i" },
  });

  if (!item?.links || !item.links[index]) {
    return { error: "not_found" };
  }

  const targetUrl = item.links[index].url?.trim();
  if (!targetUrl || !isAllowedRedirectUrl(targetUrl)) {
    return { error: "bad_url" };
  }

  return { item, targetUrl };
}

/**
 * POST only — one count per real click (no prefetch).
 * Client calls this, then opens returned url in a new tab.
 */
export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ success: false, message: "Invalid JSON" }, { status: 400 });
    }

    const handle = normalizeHandle(body.h ?? body.handle);
    const index = parseInt(String(body.i ?? body.index), 10);

    if (!handle || Number.isNaN(index) || index < 0) {
      return Response.json({ success: false, message: "Invalid request" }, { status: 400 });
    }

    const resolved = await resolveLink(handle, index);
    if (resolved.error) {
      return Response.json(
        { success: false, message: "Link not found" },
        { status: 404 }
      );
    }

    const { item, targetUrl } = resolved;
    const client = await clientPromise;
    const clickField = `analytics.linkClicks.${index}`;
    await client
      .db("bittree")
      .collection("links")
      .updateOne({ _id: item._id }, { $inc: { [clickField]: 1 } });

    return Response.json({ success: true, url: targetUrl });
  } catch (error) {
    console.error("Track POST error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
