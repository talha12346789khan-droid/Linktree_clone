import clientPromise from "@/lib/magodb";

export async function isUserBanned({ userId, email }) {
  const client = await clientPromise;
  const col = client.db("bittree").collection("banned_users");
  const or = [];
  if (userId) or.push({ userId });
  if (email) or.push({ userEmail: email.toLowerCase() });
  if (or.length === 0) return false;
  const doc = await col.findOne({ $or: or });
  return !!doc;
}

export async function assertNotBanned(session) {
  if (!session?.user?.id) return null;
  const banned = await isUserBanned({
    userId: session.user.id,
    email: session.user.email,
  });
  if (banned) {
    return "Your account has been suspended. Contact support if you believe this is a mistake.";
  }
  return null;
}
