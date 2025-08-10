import { ReactNode } from "react";

interface ListPageLayoutProps {
  title: string;
  description: string;
  actionButton?: ReactNode;
  children: ReactNode;
}

export function ListPageLayout({
  title,
  description,
  actionButton,
  children,
}: ListPageLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {actionButton}
      </div>
      {children}
    </div>
  );
}
