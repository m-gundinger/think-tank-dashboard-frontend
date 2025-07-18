// FILE: src/features/teams/components/TeamCard.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTeam } from "../api/useDeleteTeam";
import { getAbsoluteUrl } from "@/lib/utils";

export function TeamCard({ team, onEdit }: { team: any; onEdit: () => void }) {
  const deleteMutation = useDeleteTeam(team.workspaceId);
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(`Are you sure you want to delete the "${team.name}" team?`)
    ) {
      deleteMutation.mutate(team.id);
    }
  };

  return (
    <Card className="hover:border-primary flex flex-col transition-colors">
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>{team.name}</CardTitle>
          <CardDescription className="mt-1">
            {team.description || "No description provided."}
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit & Manage Members</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-600"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Team</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="text-muted-foreground mb-2 text-sm font-medium">
            Members
          </h4>
          <div className="flex items-center -space-x-2">
            {team.members.map((member: any) => (
              <Avatar key={member.id} className="h-7 w-7 border-2 border-white">
                <AvatarImage
                  src={getAbsoluteUrl(member.avatarUrl)}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
                <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length === 0 && (
              <p className="text-muted-foreground text-sm">No members yet.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
