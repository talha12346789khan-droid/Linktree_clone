import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  try {
    const session = await auth();
    if (!isAdminEmail(session?.user?.email)) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const client = await clientPromise;
    const banned = await client
      .db("bittree")
      .collection("banned_users")
      .find({})
      .sort({ bannedAt: -1 })
      .limit(100)
      .toArray();

    return Response.json({
      success: true,
      banned: banned.map((b) => ({
        id: b._id.toString(),
        userId: b.userId,
        userEmail: b.userEmail,
        userName: b.userName,
        reason: b.reason,
        bannedAt: b.bannedAt,
        bannedBy: b.bannedBy,
      })),
    });
  } catch (error) {
    console.error("Admin ban GET error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!isAdminEmail(session?.user?.email)) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const userId = body.userId?.trim();
    const userEmail = body.userEmail?.trim().toLowerCase();
    const userName = body.userName?.trim() || "User";
    const reason = (body.reason || "Violation of community guidelines").trim().slice(0, 500);

    if (!userId && !userEmail) {
      return Response.json(
        { success: false, message: "userId or userEmail required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const col = client.db("bittree").collection("banned_users");

    const filter = userId ? { userId } : { userEmail };

    await col.updateOne(
      filter,
      {
        $set: {
          userId: userId || null,
          userEmail: userEmail || null,
          userName,
          reason,
          bannedAt: new Date(),
          bannedBy: session.user.email,
        },
      },
      { upsert: true }
    );

    return Response.json({ success: true, message: "User has been banned" });
  } catch (error) {
    console.error("Admin ban POST error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    if (!isAdminEmail(session?.user?.email)) {
      return Response.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userEmail = searchParams.get("userEmail")?.toLowerCase();

    if (!userId && !userEmail) {
      return Response.json(
        { success: false, message: "userId or userEmail required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const col = client.db("bittree").collection("banned_users");
    const or = [];
    if (userId) or.push({ userId });
    if (userEmail) or.push({ userEmail });

    const result = await col.deleteOne({ $or: or });

    if (result.deletedCount === 0) {
      return Response.json({ success: false, message: "Ban not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "User unbanned" });
  } catch (error) {
    console.error("Admin ban DELETE error:", error);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
