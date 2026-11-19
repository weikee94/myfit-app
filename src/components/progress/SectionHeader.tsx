import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function SectionHeader({ title, to }: { title: string; to?: string }) {
  const heading = <h3 className="text-xl font-bold">{title}</h3>;
  if (!to) return heading;
  return (
    <Link to={to} className="flex items-center justify-between rounded-md hover:opacity-80">
      {heading}
      <ChevronRight className="h-6 w-6 text-muted-foreground" />
    </Link>
  );
}
