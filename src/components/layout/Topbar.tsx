import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./navItems";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workouts":  "Workout Log",
  "/workouts/new": "New Workout",
  "/exercises": "Exercise Library",
  "/plan":      "Training Plan",
  "/progress":  "Progress",
  "/profile":   "Profile",
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "MyFit";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-lg font-semibold tracking-tight">{title}</span>
      </div>
      {/* Desktop nav — BottomNav takes over below md. Labels appear from lg to avoid overflow at md. */}
      <nav className="hidden items-center gap-1 md:flex">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
                isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span className="hidden lg:inline">{label}</span>
          </NavLink>
        ))}
      </nav>
      <ThemeToggle className="shrink-0" />
      </div>
    </header>
  );
}
