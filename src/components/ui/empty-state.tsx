import { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
        {icon}
      </div>
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
