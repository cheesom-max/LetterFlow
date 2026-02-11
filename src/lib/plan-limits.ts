import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

type Plan = "free" | "starter" | "pro" | "team";
type Feature = "curations" | "drafts" | "topics" | "platforms" | "styleLearning";

const PLAN_LIMITS: Record<Plan, Record<Feature, number | boolean>> = {
  free:    { curations: 2,  drafts: 2,  topics: 1,  platforms: 0, styleLearning: false },
  starter: { curations: 8,  drafts: 8,  topics: 3,  platforms: 1, styleLearning: true },
  pro:     { curations: -1, drafts: -1, topics: 10, platforms: 3, styleLearning: true },
  team:    { curations: -1, drafts: -1, topics: 10, platforms: 3, styleLearning: true },
};

export type PlanLimitResult = {
  allowed: boolean;
  used: number;
  limit: number;
  plan: Plan;
};

function getMonthStart(): string {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
}

export async function checkPlanLimit(
  supabase: SupabaseClient<Database>,
  userId: string,
  feature: Feature
): Promise<PlanLimitResult> {
  // Get user plan
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", userId)
    .single();

  const plan = (profile?.plan as Plan) || "free";
  const limit = PLAN_LIMITS[plan][feature];

  // Boolean features (styleLearning)
  if (typeof limit === "boolean") {
    return { allowed: limit, used: 0, limit: limit ? 1 : 0, plan };
  }

  // Unlimited
  if (limit === -1) {
    return { allowed: true, used: 0, limit: -1, plan };
  }

  // Count-based features
  let used = 0;
  const monthStart = getMonthStart();

  if (feature === "curations") {
    const { count } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart);
    used = count || 0;
  } else if (feature === "drafts") {
    const { count } = await supabase
      .from("drafts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart);
    used = count || 0;
  } else if (feature === "topics") {
    const { count } = await supabase
      .from("topics")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    used = count || 0;
  } else if (feature === "platforms") {
    const { count } = await supabase
      .from("platform_connections")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_active", true);
    used = count || 0;
  }

  return { allowed: used < limit, used, limit, plan };
}

export { PLAN_LIMITS };
export type { Plan, Feature };
