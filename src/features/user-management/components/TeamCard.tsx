import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAbsoluteUrl } from "@/lib/utils";
import { EntityCard } from "@/components/shared/EntityCard";
import { Team } from "@/types";
import { ActionMenu } from "@/components/shared/ActionMenu";
import { useManageTeams } from "../api/useManageTeams";

export function TeamCard({ team, onEdit }: { team: Team; onEdit: () => void }) {
  const { useDelete } = useManageTeams(team.workspaceId);
  const deleteMutation = useDelete();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (
      window.confirm(`Are you sure you want to delete the "${team.name}" team?`)
    ) {
      deleteMutation.mutate(team.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit();
  };
  return (
    <EntityCard
      title={team.name}
      description={team.description || "No description provided."}
      actions={
        <ActionMenu
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteDisabled={deleteMutation.isPending}
        />
      }
    >
      <h4 className="mb-2 text-sm font-medium text-muted-foreground">
        Members
      </h4>
      <div className="flex items-center -space-x-2">
        {team.members.map((member: any) => (
          <Avatar key={member.id} className="h-7 w-7 border-2 border-card">
            <AvatarImage
              src={getAbsoluteUrl(member.avatarUrl)}
              alt={member.name}
              className="h-full w-full object-cover"
            />
            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        {team.members.length === 0 && (
          <p className="text-sm text-muted-foreground">No members yet.</p>
        )}
      </div>
    </EntityCard>
  );
}
