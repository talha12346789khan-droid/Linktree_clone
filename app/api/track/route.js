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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const handleRaw = searchParams.get("h");
    const indexParam = searchParams.get("i");
    const handle = normalizeHandle(handleRaw);
    const index = parseInt(indexParam, 10);

    if (!handle || Number.isNaN(index) || index < 0) {
      return new Response("Invalid link", { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const collection = db.collection("links");

    const item = await collection.findOne({
      handle: { $regex: `^${handle}$`, $options: "i" },
    });

    if (!item?.links || !item.links[index]) {
      return new Response("Link not found", { status: 404 });
    }

    const targetUrl = item.links[index].url?.trim();
    if (!targetUrl || !isAllowedRedirectUrl(targetUrl)) {
      return new Response("Invalid destination", { status: 400 });
    }

    const clickField = `analytics.linkClicks.${index}`;
    await collection.updateOne({ _id: item._id }, { $inc: { [clickField]: 1 } });

    return Response.redirect(targetUrl, 302);
  } catch (error) {
    console.error("Track click error:", error);
    return new Response("Server error", { status: 500 });
  }
}
