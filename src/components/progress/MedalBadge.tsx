import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AchievementTone } from "@/lib/progressStats";

// Hexagon / shield medal used by personal records, all-time stats and achievements.
// earned  → filled with a dark-to-tone gradient and a bright rim
// locked  → outline only, muted (also used for the neutral all-time stat tiles)

const HEX    = "M50 5 L91 28 L91 82 L50 105 L9 82 L9 28 Z";
const SHIELD = "M50 4 L60 13 L90 13 L90 58 Q90 90 50 106 Q10 90 10 58 L10 13 L40 13 Z";

const TONE: Record<AchievementTone, string> = {
  gold:     "#d4a72c",
  strength: "hsl(var(--strength))",
  run:      "hsl(var(--run))",
  bike:     "hsl(var(--bike))",
  swim:     "hsl(var(--swim))",
};

interface Props {
  shape?:    "hex" | "shield";
  tone?:     AchievementTone;
  earned?:   boolean;
  size?:     number;
  className?: string;
  children:  ReactNode;
}

export default function MedalBadge({ shape = "hex", tone = "gold", earned = true, size = 88, className, children }: Props) {
  const id    = useId().replace(/:/g, "");
  const color = TONE[tone];
  const d     = shape === "hex" ? HEX : SHIELD;

  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size * 1.1 }}>
      <svg viewBox="0 0 100 110" className="absolute inset-0 h-full w-full" aria-hidden>
        {earned ? (
          <>
            <defs>
              <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0"    stopColor={color} />
                <stop offset="0.55" stopColor="#111" />
                <stop offset="1"    stopColor="#000" />
              </linearGradient>
              <linearGradient id={`${id}-rim`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0"   stopColor="#fff" stopOpacity="0.85" />
                <stop offset="0.5" stopColor={color} />
                <stop offset="1"   stopColor="#fff" stopOpacity="0.6" />
              </linearGradient>
            </defs>
            <path d={d} fill={`url(#${id}-fill)`} stroke={`url(#${id}-rim)`} strokeWidth="7" strokeLinejoin="round" />
          </>
        ) : (
          <path d={d} className="fill-background stroke-border" strokeWidth="6" strokeLinejoin="round" />
        )}
      </svg>
      <div
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center font-black tracking-tight",
          earned ? "text-white drop-shadow" : "text-muted-foreground/60",
        )}
      >
        {children}
      </div>
    </div>
  );
}
