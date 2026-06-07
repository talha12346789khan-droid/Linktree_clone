import { ObjectId } from "mongodb";
import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

// GET - list all review reports
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

    const reports = await db
      .collection("review_reports")
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return Response.json({
      success: true,
      reports: reports.map((r) => ({
        id: r._id.toString(),
        reviewId: r.reviewId,
        reporterId: r.reporterId,
        reporterEmail: r.reporterEmail,
        reason: r.reason,
        status: r.status,
        createdAt: r.createdAt,
        handle: r.handle,
        reviewText: r.reviewText,
      })),
    });
  } catch (error) {
    console.error("Admin reports GET error:", error);
    return Response.json(
      { success: false, message: "Failed to load reports" },
      { status: 500 }
    );
  }
}

// PATCH - resolve a report (approve/dismiss)
export async function PATCH(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return Response.json(
        { success: false, message: "Admin access only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reportId, action } = body;

    if (!reportId || !ObjectId.isValid(reportId)) {
      return Response.json(
        { success: false, message: "Invalid report ID" },
        { status: 400 }
      );
    }

    if (!["approve", "dismiss"].includes(action)) {
      return Response.json(
        { success: false, message: "Action must be approve or dismiss" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");

    const report = await db
      .collection("review_reports")
      .findOne({ _id: new ObjectId(reportId) });

    if (!report) {
      return Response.json(
        { success: false, message: "Report not found" },
        { status: 404 }
      );
    }

    // If approved, delete the reported review
    if (action === "approve" && report.reviewId) {
      await db
        .collection("reviews")
        .deleteOne({ _id: new ObjectId(report.reviewId) })
        .catch(() => {});
    }

    // Update report status
    await db.collection("review_reports").updateOne(
      { _id: new ObjectId(reportId) },
      {
        $set: {
          status: action === "approve" ? "resolved" : "dismissed",
          resolvedBy: session.user.email,
          resolvedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      message: action === "approve" ? "Review removed and report resolved" : "Report dismissed",
    });
  } catch (error) {
    console.error("Admin reports PATCH error:", error);
    return Response.json(
      { success: false, message: "Failed to update report" },
      { status: 500 }
    );
  }
}
