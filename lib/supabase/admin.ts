import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"
import { DB_SCHEMA } from "./schema"

export function createAdminClient() {
  return createClient<Database, typeof DB_SCHEMA>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      db: { schema: DB_SCHEMA },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
