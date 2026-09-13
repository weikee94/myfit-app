import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/store/themeStore";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "light",  label: "Light",  icon: Sun     },
  { value: "dark",   label: "Dark",   icon: Moon    },
  { value: "system", label: "System", icon: Monitor },
];

const NEXT: Record<Theme, Theme> = { light: "dark", dark: "system", system: "light" };

export default function ThemeToggle({ className }: { className?: string }) {
  const theme    = useTheme((s) => s.theme);
  const setTheme = useTheme((s) => s.setTheme);
  const current  = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];
  const CurrentIcon = current.icon;

  return (
    <>
      {/* Mobile: one 44px button that cycles light → dark → system */}
      <button
        type="button"
        onClick={() => setTheme(NEXT[theme])}
        title={`${current.label} theme — tap to change`}
        aria-label={`Color theme: ${current.label}. Tap to change`}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-lg border bg-muted text-foreground transition-colors active:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:hidden",
          className
        )}
      >
        <CurrentIcon className="h-5 w-5" />
      </button>

      {/* Desktop: segmented control */}
      <div
        role="group"
        aria-label="Color theme"
        className={cn("hidden items-center gap-0.5 rounded-lg border bg-muted p-0.5 md:inline-flex", className)}
      >
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const active = theme === value;
          return (
            <button
              key={value}
              type="button"
              title={`${label} theme`}
              aria-label={`${label} theme`}
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                active && "bg-background text-foreground shadow-sm"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    </>
  );
}
