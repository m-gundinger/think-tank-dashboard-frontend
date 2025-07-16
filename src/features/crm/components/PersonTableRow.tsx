import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PersonTableRowProps {
  person: any;
  onSelect: () => void;
}

export function PersonTableRow({ person, onSelect }: PersonTableRowProps) {
  return (
    <TableRow onClick={onSelect} className="cursor-pointer">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={person.avatarUrl}
              alt={`${person.firstName} ${person.lastName}`}
            />
            <AvatarFallback>{person.firstName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{`${person.firstName} ${person.lastName}`}</span>
        </div>
      </TableCell>
      <TableCell>{person.email}</TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {person.roles.map((role: string) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={person.isActive ? "default" : "destructive"}
          className={cn(
            "pointer-events-none",
            person.isActive ? "bg-green-500" : ""
          )}
        >
          {person.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
