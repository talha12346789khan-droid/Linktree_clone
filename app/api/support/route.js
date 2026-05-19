import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Sign in required" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");
    const tickets = await db
      .collection("support_tickets")
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      tickets: tickets.map((t) => ({
        id: t._id.toString(),
        subject: t.subject,
        message: t.message,
        status: t.status,
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
        replies: t.replies || [],
      })),
    });
  } catch (error) {
    console.error("Support GET error:", error);
    return Response.json(
      { success: false, message: "Failed to load tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: "Sign in to contact support" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();

    if (subject.length < 3) {
      return Response.json(
        { success: false, message: "Subject must be at least 3 characters" },
        { status: 400 }
      );
    }

    if (message.length < 20) {
      return Response.json(
        { success: false, message: "Message must be at least 20 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");

    const doc = {
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name || session.user.email?.split("@")[0] || "User",
      subject,
      message,
      status: "open",
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("support_tickets").insertOne(doc);

    return Response.json({
      success: true,
      message: "Support ticket created",
      ticketId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("Support POST error:", error);
    return Response.json(
      { success: false, message: "Failed to create ticket" },
      { status: 500 }
    );
  }
}
