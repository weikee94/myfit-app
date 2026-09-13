import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/store/themeStore";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Theme; label: string; icon: React.ElementType }[] = [
  { value: "light",  label: "Light",  icon: Sun     },
  { value: "dark",   label: "Dark",   icon: Moon    },
  { value: "system", label: "System", icon: Monitor },
];

export default function ThemeToggle({ className }: { className?: string }) {
  const theme    = useTheme((s) => s.theme);
  const setTheme = useTheme((s) => s.setTheme);

  return (
    <div
      role="group"
      aria-label="Color theme"
      className={cn("inline-flex items-center gap-0.5 rounded-lg border bg-muted p-0.5", className)}
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
  );
}
