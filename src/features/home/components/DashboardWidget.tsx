import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface DashboardWidgetProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function DashboardWidget({
  title,
  children,
  className,
}: DashboardWidgetProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
