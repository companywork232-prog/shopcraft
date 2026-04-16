import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    "data-ocid"?: string;
  };
  children?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  action,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display font-bold text-2xl text-foreground tracking-tight truncate">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {description}
            </p>
          )}
        </div>
        {action && (
          <Button
            onClick={action.onClick}
            data-ocid={action["data-ocid"]}
            className="shrink-0 gap-1.5"
          >
            {action.icon}
            {action.label}
          </Button>
        )}
        {children}
      </div>
      <Separator />
    </div>
  );
}
