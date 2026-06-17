// ============================================================
// CarbonTwin AI - Shared Profile Hook
// ============================================================
// Centralises the profile query so Header and pages share a single
// React-Query cache entry (deduped by queryKey).

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ProfileSummary {
  id: string;
  display_name: string;
  avatar_url: string | null;
}

/**
 * Fetches the signed-in user's profile row, falling back to the email-derived
 * handle when the profile is not yet populated.
 */
export function useProfile() {
  return useQuery<ProfileSummary | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("id", userData.user.id)
        .maybeSingle();

      const fallbackName =
        userData.user.email?.split("@")[0] ?? "Explorer";

      return {
        id: userData.user.id,
        display_name: data?.display_name ?? fallbackName,
        avatar_url: data?.avatar_url ?? null,
      };
    },
    staleTime: 60_000,
  });
}
