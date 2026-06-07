import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h ${m}min`;
}

export function formatPace(secPerKm: number): string {
  const min = Math.floor(secPerKm / 60);
  const sec = secPerKm % 60;
  return `${min}:${String(sec).padStart(2, "0")}/km`;
}

export function sportColor(type: string): string {
  const map: Record<string, string> = {
    swim:     "#0ea5e9",
    bike:     "#f59e0b",
    run:      "#22c55e",
    strength: "#a855f7",
  };
  return map[type] ?? "#6b7280";
}

export function sportLabel(type: string): string {
  const map: Record<string, string> = {
    swim:     "Swim",
    bike:     "Bike",
    run:      "Run",
    strength: "Strength",
  };
  return map[type] ?? type;
}
