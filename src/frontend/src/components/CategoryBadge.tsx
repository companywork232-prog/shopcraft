import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, string> = {
  Headphones: "bg-primary/10 text-primary border-primary/20",
  Smartwatches: "bg-accent/10 text-accent border-accent/20",
  Speakers: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  Keyboards: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Monitors: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Accessories: "bg-muted text-muted-foreground border-border",
};

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colorClass =
    CATEGORY_COLORS[category] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colorClass,
        className,
      )}
    >
      {category}
    </span>
  );
}
