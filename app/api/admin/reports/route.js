import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await auth();
    if (!isAdminEmail(session?.user?.email)) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 }); 
    }

    const client = await clientPromise;
    const reports = await client
      .db("bittree")
      .collection("review_reports")
      .find({ status: "open" })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return Response.json({
      success: true,
      reports: reports.map((r) => ({
        id: r._id.toString(),
        reviewId: r.reviewId,
        handle: r.handle,
        reviewUserId: r.reviewUserId,
        reviewUserEmail: r.reviewUserEmail,
        reviewUserName: r.reviewUserName,
        reviewComment: r.reviewComment,
        reviewRating: r.reviewRating,
        reporterName: r.reporterName,
        reporterEmail: r.reporterEmail,
        reporterRole: r.reporterRole || "visitor",
        reason: r.reason,
        createdAt: r.createdAt,
      })),
    });
  }
   catch (error) {
    console.error("Admin reports GET error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await auth();
    if (!isAdminEmail(session?.user?.email)) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const reportId = body.reportId;
    const action = body.action;

    if (!reportId || !ObjectId.isValid(reportId)) {
      return Response.json({ success: false, message: "Invalid report" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const reportsCol = db.collection("review_reports");
    const reviewsCol = db.collection("reviews");

    const report = await reportsCol.findOne({ _id: new ObjectId(reportId) });
    if (!report) {
      return Response.json({ success: false, message: "Report not found" }, { status: 404 });
    }

    if (action === "dismiss") {
      await reportsCol.updateOne(
        { _id: report._id },
        { $set: { status: "dismissed", resolvedAt: new Date(), resolvedBy: session.user.email } }
      );
      return Response.json({ success: true, message: "Report dismissed" });
    }

    if (action === "delete_review") {
      if (ObjectId.isValid(report.reviewId)) {
        await reviewsCol.deleteOne({ _id: new ObjectId(report.reviewId) });
      }
      await reportsCol.updateOne(
        { _id: report._id },
        { $set: { status: "resolved", resolvedAt: new Date(), resolvedBy: session.user.email } }
      );
      await reportsCol.updateMany(
        { reviewId: report.reviewId, status: "open" },
        { $set: { status: "resolved", resolvedAt: new Date(), resolvedBy: session.user.email } }
      );
      return Response.json({ success: true, message: "Review deleted" });
    }

    return Response.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("Admin reports PATCH error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
