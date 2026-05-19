import { ObjectId } from "mongodb";
import clientPromise from "@/lib/magodb";
import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

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
    const ticketId = body.ticketId;
    const message = (body.message || "").trim();
    const status = body.status || "answered";

    if (!ticketId || !ObjectId.isValid(ticketId)) {
      return Response.json(
        { success: false, message: "Invalid ticket ID" },
        { status: 400 }
      );
    }

    if (message.length < 5) {
      return Response.json(
        { success: false, message: "Reply must be at least 5 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bittree");

    const reply = {
      from: "admin",
      authorName: session.user.name || "Admin",
      authorEmail: session.user.email,
      message,
      createdAt: new Date(),
    };

    const ticket = await db
      .collection("support_tickets")
      .findOne({ _id: new ObjectId(ticketId) });

    if (!ticket) {
      return Response.json(
        { success: false, message: "Ticket not found" },
        { status: 404 }
      );
    }

    await db.collection("support_tickets").updateOne(
      { _id: new ObjectId(ticketId) },
      {
        $push: { replies: reply },
        $set: {
          status: status === "closed" ? "closed" : "answered",
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      message: "Reply sent",
    });
  } catch (error) {
    console.error("Support admin reply error:", error);
    return Response.json(
      { success: false, message: "Failed to send reply" },
      { status: 500 }
    );
  }
}
