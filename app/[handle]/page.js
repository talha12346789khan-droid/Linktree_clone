import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import ProfileView from "@/component/ProfileView";

async function getReviewsForHandle(handle, viewerId) {
  const client = await clientPromise;
  const db = client.db("bittree");
  const canonicalHandle = handle.toLowerCase();
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

  return {
    reviews: reviews.map((r) => ({
      id: r._id.toString(),
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      isMine: !!(viewerId && r.userId === viewerId),
    })),
    summary: {
      count: reviews.length,
      average: Math.round(average * 10) / 10,
    },
  };
}

export default async function Page({ params }) {
  const { handle } = await params;
  const client = await clientPromise;
  const db = client.db("bittree");
  const collection = db.collection("links");

  const item = await collection.findOne({
    handle: { $regex: `^${handle}$`, $options: "i" },
  });

  if (!item) {
    notFound();
  }

  const session = await auth();
  const isOwnerViewingSelf =
    session?.user?.id && item.userId && session.user.id === item.userId;

  if (!isOwnerViewingSelf) {
    await collection.updateOne(
      { _id: item._id },
      { $inc: { "analytics.profileViews": 1 } }
    );
  }

  const { reviews, summary } = await getReviewsForHandle(
    item.handle,
    session?.user?.id
  );

  return (
    <ProfileView
      profile={{
        handle: item.handle,
        picture: item.picture,
        links: item.links || [],
        userId: item.userId,
      }}
      initialReviews={reviews}
      initialSummary={summary}
    />
  );
}
