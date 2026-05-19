import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getSiteVisitCount } from "@/lib/siteStats";

export async function GET() {
  try {
    const session = await auth();
    if (!isAdminEmail(session?.user?.email)) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db("bittree");

    const siteVisits = await getSiteVisitCount();
    const totalHandles = await db.collection("links").countDocuments();

    const [linkUserIds, ratingUserIds, reviewUserIds] = await Promise.all([
      db.collection("links").distinct("userId", { userId: { $exists: true, $ne: null } }),
      db.collection("app_ratings").distinct("userId", { userId: { $exists: true, $ne: null } }),
      db.collection("reviews").distinct("userId", { userId: { $exists: true, $ne: null } }),
    ]);

    const accountIds = new Set(
      [...linkUserIds, ...ratingUserIds, ...reviewUserIds].filter(Boolean)
    );

    const profiles = await db
      .collection("links")
      .find({}, { projection: { analytics: 1 } })
      .toArray();

    const totalProfileViews = profiles.reduce(
      (sum, p) => sum + (p.analytics?.profileViews || 0),
      0
    );

    const openReports = await db
      .collection("review_reports")
      .countDocuments({ status: "open" });

    const bannedUsers = await db.collection("banned_users").countDocuments();

    return Response.json({
      success: true,
      stats: {
        siteVisits,
        totalHandles,
        totalUsers: accountIds.size,
        usersWithHandle: linkUserIds.filter(Boolean).length,
        totalProfileViews,
        openReports,
        bannedUsers,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
