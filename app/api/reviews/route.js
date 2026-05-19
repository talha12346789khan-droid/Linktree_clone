import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { assertNotBanned } from "@/lib/banned";
import { ObjectId } from "mongodb";

function normalizeHandle(handle) {
  return handle?.trim().toLowerCase();
}

export async function GET(request) {
  try {
    const session = await auth();
    const { searchParams } = new URL(request.url);
    const handle = normalizeHandle(searchParams.get("handle"));

    if (!handle) {
      return Response.json(
        { success: false, message: "Handle is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const linksCol = db.collection("links");

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
    const viewerId = session?.user?.id;
    const isProfileOwner = !!(viewerId && profile.userId === viewerId);

    const reviews = await db
      .collection("reviews")
      .find({ handle: canonicalHandle })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const ratings = reviews.map((r) => r.rating);
    const average =
      ratings.length > 0
        ? ratings.reduce((sum, n) => sum + n, 0) / ratings.length
        : 0;

    return Response.json({
      success: true,
      isProfileOwner,
      reviews: reviews.map((r) => ({
        id: r._id.toString(),
        handle: r.handle,
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        isMine: !!(viewerId && r.userId === viewerId),
      })),
      summary: {
        count: ratings.length,
        average: Math.round(average * 10) / 10,
      },
    });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return Response.json(
      { success: false, message: "Failed to load reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Sign in to leave a review" },
        { status: 401 }
      );
    }

    const banMsg = await assertNotBanned(session);
    if (banMsg) {
      return Response.json({ success: false, message: banMsg }, { status: 403 });
    }

    const body = await request.json();
    const handle = normalizeHandle(body.handle);
    const rating = Number(body.rating);
    const comment = (body.comment || "").trim();

    if (!handle) {
      return Response.json(
        { success: false, message: "Handle is required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json(
        { success: false, message: "Rating must be between 1 and 5 stars" },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return Response.json(
        { success: false, message: "Review must be at least 10 characters" },
        { status: 400 }
      );
    }

    if (comment.length > 500) {
      return Response.json(
        { success: false, message: "Review must be 500 characters or less" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const linksCol = db.collection("links");
    const reviewsCol = db.collection("reviews");

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

    if (profile.userId === session.user.id) {
      return Response.json(
        { success: false, message: "You cannot review your own profile" },
        { status: 400 }
      );
    }

    const userName =
      session.user.name || session.user.email?.split("@")[0] || "User";

    await reviewsCol.updateOne(
      { handle: canonicalHandle, userId: session.user.id },
      {
        $set: {
          handle: canonicalHandle,
          userId: session.user.id,
          userEmail: session.user.email,
          userName,
          rating,
          comment,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return Response.json({
      success: true,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return Response.json(
      { success: false, message: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Sign in to delete a review" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const handle = normalizeHandle(searchParams.get("handle"));
    const reviewId = searchParams.get("reviewId");

    if (!handle) {
      return Response.json(
        { success: false, message: "Handle is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const linksCol = db.collection("links");
    const reviewsCol = db.collection("reviews");

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
    const isOwner = profile.userId === session.user.id;

    if (reviewId) {
      if (!ObjectId.isValid(reviewId)) {
        return Response.json(
          { success: false, message: "Invalid review" },
          { status: 400 }
        );
      }

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

      const canDelete =
        isOwner || review.userId === session.user.id;

      if (!canDelete) {
        return Response.json(
          { success: false, message: "You cannot delete this review" },
          { status: 403 }
        );
      }

      await reviewsCol.deleteOne({ _id: review._id });

      return Response.json({
        success: true,
        message: isOwner && review.userId !== session.user.id
          ? "Review removed from your profile"
          : "Your review was deleted",
      });
    }

    const result = await reviewsCol.deleteOne({
      handle: canonicalHandle,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "You have no review on this profile" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Your review was deleted",
    });
  } catch (error) {
    console.error("Reviews DELETE error:", error);
    return Response.json(
      { success: false, message: "Failed to delete review" },
      { status: 500 }
    );
  }
}
