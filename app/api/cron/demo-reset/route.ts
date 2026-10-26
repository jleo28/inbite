import { resetDemoWorld } from "@/lib/demo/guest"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Daily: keeps the free Supabase project awake and wipes guest changes.
export async function GET(req: Request) {
  if (!process.env.CRON_SECRET) {
    return Response.json({ error: "CRON_SECRET not configured" }, { status: 500 })
  }
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    await resetDemoWorld()
    return Response.json({ ok: true, ts: new Date().toISOString() })
  } catch (err) {
    console.error("[cron] demo-reset failed", err)
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
