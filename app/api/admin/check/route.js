import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return Response.json({ isAdmin: false }, { status: 401 });
    }

    const isAdmin = isAdminEmail(session.user.email);
    return Response.json({ isAdmin });
  } catch (error) {
    console.error("Admin check error:", error);
    return Response.json({ isAdmin: false }, { status: 500 });
  }
}
