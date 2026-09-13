import { NavLink } from "react-router-dom";
import { LayoutDashboard, Dumbbell, BookOpen, CalendarDays, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home"      },
  { to: "/workouts",  icon: Dumbbell,        label: "Log"        },
  { to: "/exercises", icon: BookOpen,        label: "Exercises"  },
  { to: "/plan",      icon: CalendarDays,    label: "Plan"       },
  { to: "/progress",  icon: TrendingUp,      label: "Progress"   },
  { to: "/profile",   icon: User,            label: "Profile"    },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-stretch">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 text-xs transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span className="font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
