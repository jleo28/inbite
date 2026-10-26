import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"
import { DB_SCHEMA } from "./schema"

export function createClient() {
  return createBrowserClient<Database, typeof DB_SCHEMA>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { db: { schema: DB_SCHEMA } }
  )
}
