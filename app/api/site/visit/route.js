import { incrementSiteVisits } from "@/lib/siteStats";

export async function POST() {
  try {
    await incrementSiteVisits();
    return Response.json({ success: true });
  } catch (error) {
    console.error("Site visit error:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
