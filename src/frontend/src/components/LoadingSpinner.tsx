import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const SIZE_CLASSES = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-[3px]",
};

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div
        className={cn(
          "rounded-full border-muted-foreground/20 border-t-primary animate-spin",
          SIZE_CLASSES[size],
        )}
        role="status"
        aria-label={label ?? "Loading"}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[40vh]">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
