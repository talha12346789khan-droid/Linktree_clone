import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

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
    const tickets = await db
      .collection("support_tickets")
      .find({})
      .sort({ updatedAt: -1 })
      .limit(200)
      .toArray();

    return Response.json({
      success: true,
      tickets: tickets.map((t) => ({
        id: t._id.toString(),
        userId: t.userId,
        userEmail: t.userEmail,
        userName: t.userName,
        subject: t.subject,
        message: t.message,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        replies: t.replies || [],
      })),
    });
  } catch (error) {
    console.error("Support admin GET error:", error);
    return Response.json(
      { success: false, message: "Failed to load tickets" },
      { status: 500 }
    );
  }
}
