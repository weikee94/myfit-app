import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProfile, updateProfile } from "@/api/profiles";
import type { ProfileRow } from "@/types/database";

type ProfileUpdate = Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">>;

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn:  () => fetchProfile(userId),
    enabled:  !!userId,
  });
}

export function useUpdateProfile(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (update: ProfileUpdate) => updateProfile(userId, update),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["profile", userId] }),
  });
}
