import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import type { Database } from "./database.types";

export async function getAuthenticatedUser(request: NextRequest) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Route Handlers cannot set cookies on the request
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, supabase, error: "Unauthorized" as const };
  }

  return { user, supabase, error: null };
}
