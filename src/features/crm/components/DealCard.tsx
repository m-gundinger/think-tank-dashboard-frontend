import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Deal } from "../crm.types";

interface DealCardProps {
  deal: Deal;
  onSelect: (dealId: string) => void;
}

export function DealCard({ deal, onSelect }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    data: {
      type: "Deal",
      deal,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="mb-2 cursor-grab active:cursor-grabbing"
        onClick={() => onSelect(deal.id)}
      >
        <CardHeader className="p-3">
          <CardTitle className="text-sm">{deal.name}</CardTitle>
          <CardDescription className="text-xs">
            {deal.company.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between p-3 pt-0">
          <span className="text-sm font-semibold">
            {currencyFormatter.format(deal.value)}
          </span>
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {deal.ownerName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>
    </div>
  );
}
