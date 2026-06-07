import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

// GET - list all banned users
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
    const banned = await db
      .collection("banned_users")
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return Response.json({
      success: true,
      banned: banned.map((b) => ({
        id: b._id.toString(),
        userId: b.userId,
        userEmail: b.userEmail,
        userName: b.userName,
        reason: b.reason,
        createdAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error("Admin ban GET error:", error);
    return Response.json(
      { success: false, message: "Failed to load banned users" },
      { status: 500 }
    );
  }
}

// POST - ban a user
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return Response.json(
        { success: false, message: "Admin access only" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, userEmail, userName, reason } = body;

    if (!userId && !userEmail) {
      return Response.json(
        { success: false, message: "Provide userId or email" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");

    const filter = {};
    if (userId) filter.userId = userId;
    else if (userEmail) filter.userEmail = userEmail.toLowerCase();

    const existing = await db.collection("banned_users").findOne(filter);
    if (existing) {
      return Response.json(
        { success: false, message: "User is already banned" },
        { status: 409 }
      );
    }

    await db.collection("banned_users").insertOne({
      userId: userId || null,
      userEmail: userEmail ? userEmail.toLowerCase() : null,
      userName: userName || null,
      reason: reason || "Violated terms of service",
      bannedBy: session.user.email,
      createdAt: new Date(),
    });

    return Response.json({ success: true, message: "User banned successfully" });
  } catch (error) {
    console.error("Admin ban POST error:", error);
    return Response.json(
      { success: false, message: "Failed to ban user" },
      { status: 500 }
    );
  }
}

// DELETE - unban a user
export async function DELETE(request) {
  try {
    const session = await auth();
    if (!session?.user?.email || !isAdminEmail(session.user.email)) {
      return Response.json(
        { success: false, message: "Admin access only" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userEmail = searchParams.get("userEmail");

    if (!userId && !userEmail) {
      return Response.json(
        { success: false, message: "Provide userId or userEmail" },
        { status: 400 }
      );
    }

    const filter = {};
    if (userId) filter.userId = userId;
    else if (userEmail) filter.userEmail = userEmail.toLowerCase();

    const client = await clientPromise;
    const db = client.db("bittree");
    const result = await db.collection("banned_users").deleteOne(filter);

    if (result.deletedCount === 0) {
      return Response.json(
        { success: false, message: "User not found in ban list" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "User unbanned successfully" });
  } catch (error) {
    console.error("Admin ban DELETE error:", error);
    return Response.json(
      { success: false, message: "Failed to unban user" },
      { status: 500 }
    );
  }
}
