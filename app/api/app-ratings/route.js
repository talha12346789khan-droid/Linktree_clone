import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    const viewerId = session?.user?.id;

    const client = await clientPromise;
    const db = client.db("bittree");
    const ratings = await db
      .collection("app_ratings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const values = ratings.map((r) => r.rating);
    const average =
      values.length > 0
        ? values.reduce((sum, n) => sum + n, 0) / values.length
        : 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    values.forEach((n) => {
      if (distribution[n] !== undefined) distribution[n]++;
    });

    return Response.json({
      success: true,
      ratings: ratings.map((r) => ({
        id: r._id.toString(),
        userName: r.userName,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        isMine: !!(viewerId && r.userId === viewerId),
      })),
      summary: {
        count: ratings.length,
        average: Math.round(average * 10) / 10,
        distribution,
      },
    });
  } catch (error) {
    console.error("App ratings GET error:", error);
    return Response.json(
      { success: false, message: "Failed to load ratings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Sign in to rate the app" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const rating = Number(body.rating);
    const comment = (body.comment || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json(
        { success: false, message: "Please select a rating from 1 to 5 stars" },
        { status: 400 }
      );
    }

    if (comment.length < 10) {
      return Response.json(
        { success: false, message: "Please write at least 10 characters" },
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
    const userName =
      session.user.name || session.user.email?.split("@")[0] || "User";

    await db.collection("app_ratings").updateOne(
      { userId: session.user.id },
      {
        $set: {
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
      message: "Thanks for rating LinkTree Clone!",
    });
  } catch (error) {
    console.error("App ratings POST error:", error);
    return Response.json(
      { success: false, message: "Failed to submit rating" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Sign in to delete your rating" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const result = await db
      .collection("app_ratings")
      .deleteOne({ userId: session.user.id });

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "You have not rated the app yet" },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      message: "Your rating was removed",
    });
  } catch (error) {
    console.error("App ratings DELETE error:", error);
    return Response.json(
      { success: false, message: "Failed to delete rating" },
      { status: 500 }
    );
  }
}
