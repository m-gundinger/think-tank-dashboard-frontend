import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PersonCardProps {
  person: any;
  onSelect: () => void;
}

export function PersonCard({ person, onSelect }: PersonCardProps) {
  return (
    <Card
      className="hover:border-primary cursor-pointer transition-colors"
      onClick={onSelect}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={person.avatarUrl} alt={person.name} />
          <AvatarFallback>{person.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-base">{person.name}</CardTitle>
          <CardDescription className="text-xs">{person.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {person.roles.map((role: string) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
