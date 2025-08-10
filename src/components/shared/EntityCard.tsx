import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EntityCardProps {
  title: string;
  description?: string | null;
  linkTo?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  actions?: React.ReactNode;
}

export function EntityCard({
  title,
  description,
  linkTo,
  children,
  icon: Icon,
  actions,
}: EntityCardProps) {
  const CardBody = (
    <Card className="flex h-full flex-col transition-colors hover:border-primary">
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-6 w-6 text-gray-400" />}
          <div className="flex-grow">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
        </div>
        {actions}
      </CardHeader>
      {children}
    </Card>
  );

  return linkTo ? (
    <Link to={linkTo} className="block h-full">
      {CardBody}
    </Link>
  ) : (
    CardBody
  );
}
