import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { getSiteVisitCount } from "@/lib/siteStats";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return Response.json(
        { success: false, message: "Admin access only" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");

    const [
      totalHandles,
      totalUsers,
      usersWithHandle,
      totalProfileViews,
      openReports,
      bannedUsers,
      siteVisits,
    ] = await Promise.all([
      db.collection("links").countDocuments(),
      db.collection("users").countDocuments().catch(() => 0),
      db.collection("links").countDocuments({ handle: { $exists: true, $ne: "" } }),
      db.collection("links").aggregate([
        { $group: { _id: null, total: { $sum: "$analytics.profileViews" } } },
      ]).toArray().then((r) => r[0]?.total || 0),
      db.collection("review_reports").countDocuments({ status: "open" }),
      db.collection("banned_users").countDocuments(),
      getSiteVisitCount(),
    ]);

    return Response.json({
      success: true,
      stats: {
        siteVisits,
        totalHandles,
        totalUsers,
        usersWithHandle,
        totalProfileViews,
        openReports,
        bannedUsers,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return Response.json(
      { success: false, message: "Failed to load stats" },
      { status: 500 }
    );
  }
}
