import { auth } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export async function GET() {
  const session = await auth();
  return Response.json({
    isAdmin: isAdminEmail(session?.user?.email),
  });
}
