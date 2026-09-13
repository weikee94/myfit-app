import { LayoutDashboard, Dumbbell, BookOpen, CalendarDays, TrendingUp, User } from "lucide-react";

// Shared by BottomNav (mobile) and Topbar (desktop).
export const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home"      },
  { to: "/workouts",  icon: Dumbbell,        label: "Log"        },
  { to: "/exercises", icon: BookOpen,        label: "Exercises"  },
  { to: "/plan",      icon: CalendarDays,    label: "Plan"       },
  { to: "/progress",  icon: TrendingUp,      label: "Progress"   },
  { to: "/profile",   icon: User,            label: "Profile"    },
];
