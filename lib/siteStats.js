import clientPromise from "@/lib/magodb";

const GLOBAL_ID = "global";

export async function incrementSiteVisits() {
  const client = await clientPromise;
  const col = client.db("bittree").collection("site_stats");
  await col.updateOne(
    { _id: GLOBAL_ID },
    {
      $inc: { siteVisits: 1 },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  );
}

export async function getSiteVisitCount() {
  const client = await clientPromise;
  const doc = await client.db("bittree").collection("site_stats").findOne({
    _id: GLOBAL_ID,
  });
  return doc?.siteVisits || 0;
}
