import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { ObjectId } from "mongodb";

function normalizeHandle(handle) {
  return handle?.trim().toLowerCase();
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Sign in to report a review" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const handle = normalizeHandle(body.handle);
    const reviewId = body.reviewId;
    const reason = (body.reason || "spam").trim().slice(0, 500);

    if (!handle || !reviewId || !ObjectId.isValid(reviewId)) {
      return Response.json(
        { success: false, message: "Invalid report" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const linksCol = db.collection("links");
    const reviewsCol = db.collection("reviews");
    const reportsCol = db.collection("review_reports");

    const profile = await linksCol.findOne({
      handle: { $regex: `^${handle}$`, $options: "i" },
    });

    if (!profile) {
      return Response.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    const canonicalHandle = profile.handle.toLowerCase();

    const review = await reviewsCol.findOne({
      _id: new ObjectId(reviewId),
      handle: canonicalHandle,
    });

    if (!review) {
      return Response.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    if (review.userId === session.user.id) {
      return Response.json(
        { success: false, message: "You cannot report your own review" },
        { status: 400 }
      );
    }

    const existing = await reportsCol.findOne({
      reviewId: review._id.toString(),
      reporterId: session.user.id,
      status: "open",
    });

    if (existing) {
      return Response.json(
        { success: false, message: "You already reported this review" },
        { status: 400 }
      );
    }

    await reportsCol.insertOne({
      reviewId: review._id.toString(),
      handle: canonicalHandle,
      profileOwnerId: profile.userId,
      reviewUserId: review.userId,
      reviewUserEmail: review.userEmail,
      reviewUserName: review.userName,
      reviewComment: review.comment,
      reviewRating: review.rating,
      reporterId: session.user.id,
      reporterEmail: session.user.email,
      reporterName:
        session.user.name || session.user.email?.split("@")[0] || "User",
      reason,
      status: "open",
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      message: "Report submitted. Our team will review it.",
    });
  } catch (error) {
    console.error("Review report error:", error);
    return Response.json(
      { success: false, message: "Failed to submit report" },
      { status: 500 }
    );
  }
}
