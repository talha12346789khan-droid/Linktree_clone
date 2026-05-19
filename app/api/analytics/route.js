import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import {
  parseRange,
  buildViewsByDay,
  buildClicksByDay,
  buildClicksByLink,
  sumViewsInRange,
  sumClicksInRange,
} from "@/lib/analyticsDaily";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "You must be logged in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = parseRange(searchParams);

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
    const daily = analytics.daily || {};
    const links = doc.links || [];

    const linksWithStats = buildClicksByLink(links, linkClicks);
    const totalClicks = linksWithStats.reduce((sum, l) => sum + l.clicks, 0);

    const viewsInRange = sumViewsInRange(daily, range);
    const clicksInRange = sumClicksInRange(daily, range);
    const ctr =
      viewsInRange > 0
        ? Math.round((clicksInRange / viewsInRange) * 1000) / 1000
        : 0;

    return Response.json({
      success: true,
      result: {
        handle: doc.handle,
        profileViews,
        totalClicks,
        links: linksWithStats,
        range,
        series: {
          viewsByDay: buildViewsByDay(daily, range),
          clicksByDay: buildClicksByDay(daily, range),
          clicksByLink: linksWithStats,
        },
        summary: {
          viewsInRange,
          clicksInRange,
          ctr,
        },
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
