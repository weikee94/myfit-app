import { useLocation } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workouts":  "Workout Log",
  "/workouts/new": "New Workout",
  "/exercises": "Exercise Library",
  "/progress":  "Progress",
  "/profile":   "Profile",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "MyFit";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-lg font-semibold tracking-tight">{title}</span>
      </div>
      <ThemeToggle className="shrink-0" />
    </header>
  );
}
