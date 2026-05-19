import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "You must be logged in" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const collection = db.collection("links");

    let doc = await collection.findOne({ userId: session.user.id });
    if (!doc && session.user.email) {
      doc = await collection.findOne({ userEmail: session.user.email });
    }

    if (!doc) {
      return Response.json({
        success: true,
        message: "No profile yet",
        result: null,
      });
    }

    const analytics = doc.analytics || {};
    const profileViews = analytics.profileViews || 0;
    const linkClicks = analytics.linkClicks || {};
    const links = doc.links || [];

    const linksWithStats = links.map((link, index) => ({
      name: link.name,
      url: link.url,
      clicks: linkClicks[String(index)] || linkClicks[index] || 0,
    }));

    const totalClicks = linksWithStats.reduce((sum, l) => sum + l.clicks, 0);

    return Response.json({
      success: true,
      result: {
        handle: doc.handle,
        profileViews,
        totalClicks,
        links: linksWithStats,
      },
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
