import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchMyProfile } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth-store";

export function RatingChip() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: fetchMyProfile,
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const rating = profile?.rating ?? 1200;

  return (
    <Link
      to="/profile"
      className="group relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-arena-purple-light bg-arena-surface-purple hover:bg-arena-purple-verylight hover:border-arena-purple-soft text-arena-purple text-xs font-mono font-bold transition-all duration-200 shadow-sm"
      title="Competitive Rating"
    >
      <span className="text-[10px] text-arena-purple font-extrabold group-hover:scale-110 transition-transform">◆</span>
      <span>{rating}</span>
      <span className="text-[10px] text-arena-text-secondary font-sans tracking-wide">ELO</span>
    </Link>
  );
}
